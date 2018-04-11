package it.smartcommunitylab.streetcleaning.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.PointBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;

public class Utils {

	private static final long MILLIS_IN_DAY = 1000 * 60 * 60 * 24L;

	private static final Logger logger = Logger.getLogger(Utils.class);

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yy");
	private static final SimpleDateFormat TIME_FORMAT = new SimpleDateFormat("hh:mm");

	private static ObjectMapper fullMapper = new ObjectMapper();
	static {
		Utils.fullMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		Utils.fullMapper.configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true);
		Utils.fullMapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
		Utils.fullMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		Utils.fullMapper.configure(SerializationFeature.INDENT_OUTPUT, false);
	}

	public static JsonNode readJsonFromString(String json)
			throws JsonParseException, JsonMappingException, IOException {
		return Utils.fullMapper.readValue(json, JsonNode.class);
	}

	public static JsonNode readJsonFromReader(Reader reader) throws JsonProcessingException, IOException {
		return Utils.fullMapper.readTree(reader);
	}

	public static <T> List<T> readJSONListFromInputStream(InputStream in, Class<T> cls) throws IOException {
		List<Object> list = Utils.fullMapper.readValue(in, new TypeReference<List<?>>() {
		});
		List<T> result = new ArrayList<T>();
		for (Object o : list) {
			result.add(Utils.fullMapper.convertValue(o, cls));
		}
		return result;
	}

	public static <T> T toObject(Object in, Class<T> cls) {
		return Utils.fullMapper.convertValue(in, cls);
	}

	public static <T> T toObject(JsonNode in, Class<T> cls) throws JsonProcessingException {
		return Utils.fullMapper.treeToValue(in, cls);
	}

	public static boolean isNotEmpty(String value) {
		boolean result = false;
		if ((value != null) && (!value.isEmpty())) {
			result = true;
		}
		return result;
	}

	public static boolean isEmpty(String value) {
		boolean result = true;
		if ((value != null) && (!value.isEmpty())) {
			result = false;
		}
		return result;
	}

	public static String getUUID() {
		return UUID.randomUUID().toString();
	}

	public static String getString(Map<String, String> data, String lang, String defaultLang) {
		String result = null;
		if (data.containsKey(lang)) {
			result = data.get(lang);
		} else {
			result = data.get(defaultLang);
		}
		return result;
	}

	public static Map<String, String> handleError(Exception exception) {
		Map<String, String> errorMap = new HashMap<String, String>();
		errorMap.put(Const.ERRORTYPE, exception.getClass().toString());
		errorMap.put(Const.ERRORMSG, exception.getMessage());
		return errorMap;
	}

	public static List<StreetBean> readKmlFile(String src)
			throws ParserConfigurationException, SAXException, IOException {
		List<StreetBean> streets = new ArrayList<StreetBean>();
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = (Document) dBuilder
				.parse(Thread.currentThread().getContextClassLoader().getResourceAsStream(src));
		doc.getDocumentElement().normalize();
		logger.debug("Doc content: " + doc.getDocumentElement().getTagName());
		NodeList streetList = ((Element) ((Element) ((Element) doc.getElementsByTagName("kml").item(0))
				.getElementsByTagName("Document").item(0)).getElementsByTagName("Folder").item(0))
						.getElementsByTagName("Placemark");

		for (int temp = 0; temp < streetList.getLength(); temp++) {
			Element e = ((Element) streetList.item(temp));

			NodeList fields = ((Element) ((Element) e.getElementsByTagName("ExtendedData").item(0))
					.getElementsByTagName("SchemaData").item(0)).getElementsByTagName("SimpleData");
			StreetBean sb = new StreetBean();
			String code = "";
			for (int j = 0; j < fields.getLength(); j++) {
				Element field = ((Element) fields.item(j));
				String value = field.getTextContent().trim();
				if ("desvia".equals(field.getAttribute("name"))) {
					sb.setName(value);
					sb.setDescription(value);
				}
				if ("codice".equals(field.getAttribute("name"))) {
					code = code.length() > 0 ? value + code : value;
				}
				if ("pulizia_CO".equals(field.getAttribute("name"))) {
					code += "_" + value;
				}
				//
				if ("strada".equals(field.getAttribute("name"))) {
					code = code.length() > 0 ? value + code : value;
				}
				if ("percorso".equals(field.getAttribute("name"))) {
					code += "_" + value;
				}
			}
			sb.setCode(code);
			sb.setCentralCoords(new ArrayList<PointBean>());
			sb.setPolyline(new ArrayList<String>());
//			NodeList lines = ((Element) e.getElementsByTagName("MultiGeometry").item(0))
//					.getElementsByTagName("LineString");
			NodeList lines = e.getElementsByTagName("LineString");
			for (int j = 0; j < lines.getLength(); j++) {
				Element line = (Element) lines.item(j);
				String coordinates = line.getElementsByTagName("coordinates").item(0).getTextContent();
				String poly = "";
				PointBean centralCoords = null;
				if (coordinates != null && coordinates.length() > 0) {
					List<PointBean> points = new ArrayList<PointBean>();
					String[] coords = coordinates.split(" ");
					for (int i = 0; i < coords.length; i++) {
						String[] coord = coords[i].split(",");
						String lat = coord[1];
						String lng = coord[0];
						if (i >= coords.length / 2 && centralCoords == null) {
							double lat_val = Double.parseDouble(lat);
							double lng_val = Double.parseDouble(lng);
							centralCoords = new PointBean(lat_val, lng_val);
						}
						PointBean pb = new PointBean();
						pb.setLat(Double.parseDouble(lat));
						pb.setLng(Double.parseDouble(lng));
						points.add(pb);
					}
					poly = PolylineEncoder.encode(points);
				}
				sb.getCentralCoords().add(centralCoords);
				sb.getPolyline().add(poly);
			}

			logger.debug(String.format("Street name %s, description %s, code %s, polyline %s", sb.getName(),
					sb.getDescription(), code, sb.getPolyline()));
			streets.add(sb);
		}

		return streets;
	}

	public static List<CalendarDataBean> readCalendarFile(String src, List<StreetBean> streets) throws Exception {
		List<CalendarDataBean> cal_days = new ArrayList<CalendarDataBean>();
		BufferedReader br = null;
		String line = "";
		String cvsSplitBy = ",";

		try {
			br = new BufferedReader(
					new InputStreamReader(Thread.currentThread().getContextClassLoader().getResourceAsStream(src)));
			line = br.readLine(); // here I read the first line that contains
									// information of version
			CalendarDataBean tmp_cal = null;
			while ((line = br.readLine()) != null) {
				// use comma as separator
				String[] calendarCleaning = line.split(cvsSplitBy);
				String date = calendarCleaning[0];
				Long dateVal = dateFromItaString(date);
				String codice = calendarCleaning[1];
				String codiceTratto = calendarCleaning[2];
				String street = calendarCleaning[3];
				String startingTime = calendarCleaning[4];
				String endingTime = calendarCleaning[5];
				String note = null;
				if (calendarCleaning.length > 6) {
					note = calendarCleaning[6];
				}
				long startingTimeMillis = 0L;
				long endingTimeMillis = 0L;
				if (startingTime != null && startingTime.compareTo("") != 0) {
					startingTimeMillis = millisFromItaValueAndDate(dateVal, startingTime);
				}
				if (endingTime != null && endingTime.compareTo("") != 0) {
					endingTimeMillis = millisFromItaValueAndDate(dateVal, endingTime);
				}
				if (startingTimeMillis > endingTimeMillis) { // Here I update
																// the ending
																// time adding a
																// day
					endingTimeMillis = millisFromItaValueAndDate(dateVal + MILLIS_IN_DAY, endingTime);
				}
				// Here I have to find a street and get all polylines;
				String code = codice + "_" + codiceTratto;
				StreetBean reference = null;
				for (StreetBean sb : streets) {
					if (sb.getCode().equals(code)) {
						reference = sb;
						break;
					}
				}
				if (reference == null) {
					System.err.println(codice + " / " + codiceTratto);
					;// throw new IllegalArgumentException("Unknown street: "+
						// code);
					continue;
				}

				tmp_cal = new CalendarDataBean(street, code, dateVal, startingTimeMillis, endingTimeMillis, note,
						reference.getCentralCoords(), reference.getPolyline());
				cal_days.add(tmp_cal);
				// logger.debug(String.format("Calendar cleaning value: %s",
				// tmp_cal.toString()));
			}
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return cal_days;
	}

	private static Long dateFromItaString(String itaVal) throws ParseException {
		return DATE_FORMAT.parse(itaVal).getTime();
	}

	private static Long millisFromItaValueAndDate(Long date, String time) throws ParseException {
		Date parsed = TIME_FORMAT.parse(time);
		Calendar cal = Calendar.getInstance(Locale.ITALY);
		cal.setTimeInMillis(date);
		Calendar calTime = Calendar.getInstance(Locale.ITALY);
		calTime.setTime(parsed);
		cal.set(Calendar.HOUR_OF_DAY, calTime.get(Calendar.HOUR_OF_DAY));
		cal.set(Calendar.MINUTE, calTime.get(Calendar.MINUTE));
		cal.set(Calendar.SECOND, 0);
		return cal.getTimeInMillis();
	}

	public static Date getStartOfDay(Long millis) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(millis);
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH);
		int day = calendar.get(Calendar.DATE);
		calendar.set(year, month, day, 0, 0, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}

}
