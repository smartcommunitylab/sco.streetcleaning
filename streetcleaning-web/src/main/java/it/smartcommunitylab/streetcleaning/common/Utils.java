package it.smartcommunitylab.streetcleaning.common;

import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.PointBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.model.Version;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Calendar;
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

public class Utils {
	
	private static final long MILLIS_IN_DAY = 1000 * 60 * 60 * 24L;
	
	private static final Logger logger = Logger
			.getLogger(Utils.class);
	
	private static ObjectMapper fullMapper = new ObjectMapper();
	static {
		Utils.fullMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		Utils.fullMapper.configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true);
		Utils.fullMapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
		Utils.fullMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		Utils.fullMapper.configure(SerializationFeature.INDENT_OUTPUT, false);
	}
	
	public static JsonNode readJsonFromString(String json) throws JsonParseException, JsonMappingException, IOException {
		return Utils.fullMapper.readValue(json, JsonNode.class);
	}
	
	public static JsonNode readJsonFromReader(Reader reader) throws JsonProcessingException, IOException {
		return Utils.fullMapper.readTree(reader);
	}
	
	public static <T> List<T> readJSONListFromInputStream(InputStream in, Class<T> cls)
			throws IOException {
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
		if(data.containsKey(lang)) {
			result = data.get(lang);
		} else {
			result = data.get(defaultLang);
		}
		return result;
	}

	public static Map<String,String> handleError(Exception exception) {
		Map<String,String> errorMap = new HashMap<String,String>();
		errorMap.put(Const.ERRORTYPE, exception.getClass().toString());
		errorMap.put(Const.ERRORMSG, exception.getMessage());
		return errorMap;
	}
	
	public static List<StreetBean> readKmlFile(String src) throws ParserConfigurationException, SAXException, IOException {
		List<StreetBean> streets = new ArrayList<StreetBean>();
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = (Document) dBuilder.parse(Thread.currentThread().getContextClassLoader().getResourceAsStream(src));
		doc.getDocumentElement().normalize();
		logger.debug("Doc content: " + doc.getDocumentElement().getTagName());
		NodeList streetList = ((Element)((Element)((Element)doc.getElementsByTagName("kml").item(0)).getElementsByTagName("Document").item(0)).getElementsByTagName("Folder").item(0)).getElementsByTagName("Placemark");
		
		for (int temp = 0; temp < streetList.getLength(); temp++) {
			Element e = ((Element)streetList.item(temp));
			String streetName = e.getElementsByTagName("name").item(0).getTextContent();
			String streetDesc = e.getElementsByTagName("description").item(0).getTextContent();
			String code = ((Element)((Element)e.getElementsByTagName("ExtendedData").item(0)).getElementsByTagName("SchemaData").item(0)).getElementsByTagName("SimpleData").item(0).getTextContent();
			String coordinates = ((Element)e.getElementsByTagName("LineString").item(0)).getElementsByTagName("coordinates").item(0).getTextContent();
			String poly = "";
			PointBean centralCoords = null;
			if(coordinates != null && coordinates.length() > 0){
				List<PointBean> points = new ArrayList<PointBean>();
				String[] coords = coordinates.split(" ");
				for(int i = 0; i < coords.length; i++){
					String[] coord = coords[i].split(",");
					String lat = coord[1];
					String lng = coord[0];
					if(i >= coords.length/2 && centralCoords == null){
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
			logger.debug(String.format("Street name %s, description %s, code %s, polyline %s", streetName, streetDesc, code, poly));
			if(streetName != null && streetName.compareTo("") != 0){
				StreetBean s = new StreetBean(code, streetName, streetDesc, centralCoords, poly);
				streets.add(s);
			}
		}
		
		return streets;
	}
	
	@SuppressWarnings("unchecked")
	public static List<CalendarDataBean> readCalendarFile(String src, Version dataVersion, List<StreetBean> streets) {
		List<CalendarDataBean> cal_days = new ArrayList<CalendarDataBean>();
		BufferedReader br = null;
		String line = "";
		String cvsSplitBy = ",";
		
		try {
			br = new BufferedReader(new FileReader(src));
			line = br.readLine();	// here I read the first line that contains information of version
			String[] versionsData = line.split(cvsSplitBy);
			String version = versionsData[1];
			if(version.compareTo(dataVersion.getVersion()) != 0){	// new data version
				CalendarDataBean tmp_cal = null;
				while ((line = br.readLine()) != null) {
				    // use comma as separator
					String[] calendarCleaning = line.split(cvsSplitBy);
					String street = calendarCleaning[0];
					String date = calendarCleaning[1];
					Long dateVal = dateFromItaString(date);
					String startingTime = "";
					String endingTime = "";
					String note = "";
					long startingTimeMillis = 0L;
					long endingTimeMillis = 0L;
					if(calendarCleaning.length == 5){
						startingTime = calendarCleaning[2];
						endingTime = calendarCleaning[3];
						note = calendarCleaning[4];
					} else if(calendarCleaning.length == 4){
						startingTime = calendarCleaning[2];
						endingTime = calendarCleaning[3];
					} else if(calendarCleaning.length == 3){
						note = calendarCleaning[2];
					}
					if(startingTime != null && startingTime.compareTo("")!=0){
						startingTimeMillis = millisFromItaValueAndDate(dateVal, startingTime);
					}
					if(endingTime != null && endingTime.compareTo("")!=0){
						endingTimeMillis = millisFromItaValueAndDate(dateVal, endingTime);
					}
					if(startingTimeMillis > endingTimeMillis){	// Here I update the ending time adding a day
						endingTimeMillis = millisFromItaValueAndDate(dateVal + MILLIS_IN_DAY, endingTime);
					}
					// Here I have to find a street and get all polylines;
					String streetCode = getCodeFromStreetName(street, streets);
					List<String> polyline = null;
					List<PointBean> centralCoords = null;
					if(streetCode.compareTo("") != 0){
						polyline = (List<String>)getStreetPolylinesFromCode(streetCode, streets).get(0);
						centralCoords = (List<PointBean>)getStreetPolylinesFromCode(streetCode, streets).get(1);
					}
					tmp_cal = new CalendarDataBean(street, streetCode, dateVal, startingTimeMillis, endingTimeMillis, note, centralCoords, polyline);
					cal_days.add(tmp_cal);
					logger.debug(String.format("Calendar cleaning value: %s", tmp_cal.toString()));
				}
			}	
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
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
	
	private static String getCodeFromStreetName(String name, List<StreetBean> streets){
		for(StreetBean s:streets){
			if(s.getName().compareTo(name.trim()) == 0){
				return s.getCode();
			} else {
				if(name.contains("S. ")){	// case of S. - SAN
					String corrName = s.getName();
					if(s.getName().contains("SAN ")){
						corrName = s.getName().replace("SAN ", "S. ");
					} else if(corrName.contains("SANTA ")){
						corrName = s.getName().replace("SANTA ", "S. ");
					} else if(corrName.contains("SANTA TRINITA'")){			// specific case for santa trinita'
						corrName = s.getName().replace("SANTA ", "SS. ");
					}
					String[] completeStreetName = name.split(" ");
					String recomposeStreet = "";
					for(int x = 1; x < completeStreetName.length; x++){
						recomposeStreet += completeStreetName[x] + " ";
					}
					recomposeStreet = recomposeStreet.substring(0, recomposeStreet.length() - 1);
					if(corrName.contains(recomposeStreet)){
						return s.getCode();
					}
				} else {
					String[] completeStreetName = name.split(" ");
					String onlyStreet = completeStreetName[completeStreetName.length - 1];	// Here I consider only the street name
					if(s.getName().contains(onlyStreet)){
						return s.getCode();
					}
				}
			}
		}
		logger.error(String.format("No street found for %s", name));
		return "";
	}
	
	@SuppressWarnings("rawtypes")
	private static List<List> getStreetPolylinesFromCode(String code, List<StreetBean> streets){
		List<String> polylines = new ArrayList<String>();
		List<PointBean> centralCoords = new ArrayList<PointBean>();
		for(StreetBean s:streets){
			if(s.getCode().compareTo(code.trim()) == 0){
				polylines.add(s.getPolyline());
				centralCoords.add(s.getCentralCoords());
			}
		}
		List<List> matrixData = new ArrayList<List>();
		matrixData.add(polylines);
		matrixData.add(centralCoords);
		return matrixData;
	}
	
	public static Version readCalendarFileVersion(String src) {
		Version v = new Version();
		BufferedReader br = null;
		String line = "";
		String cvsSplitBy = ",";
		
		try {
			br = new BufferedReader(new FileReader(src));
			line = br.readLine();	// here I read the first line that contains information of version
			String[] versionsData = line.split(cvsSplitBy);
			String version = versionsData[2];
			String version_date = versionsData[1];
			Long version_date_millis = dateFromItaString(version_date);
			// insert version data in DB
			v.setVersion(version);
			v.setUpdate_time(version_date_millis);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return v;
	}
	
	private static Long dateFromItaString(String itaVal){
		Calendar cal = Calendar.getInstance(Locale.ITALY);
		String[] dateComponents = itaVal.split("/");
		int year = Integer.parseInt(dateComponents[2]);
		int month = Integer.parseInt(dateComponents[1]);
		int date = Integer.parseInt(dateComponents[0]);
		cal.set(Calendar.YEAR, year);
		cal.set(Calendar.MONTH, month-1);
		cal.set(Calendar.DAY_OF_MONTH, date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTimeInMillis();
	}
	
	private static Long millisFromItaValueAndDate(Long date, String time){
		Calendar cal = Calendar.getInstance(Locale.ITALY);
		cal.setTimeInMillis(date);
		Long tmpTime = 0L;
		String[] hourComponents = time.split(":");
		int hours = Integer.parseInt(hourComponents[0]);
		int minutes = Integer.parseInt(hourComponents[1]);
		cal.set(Calendar.HOUR_OF_DAY, hours);
		cal.set(Calendar.MINUTE, minutes);
		cal.set(Calendar.SECOND, 0);
		tmpTime = cal.getTimeInMillis();
		return tmpTime;
	}
	
	
}
