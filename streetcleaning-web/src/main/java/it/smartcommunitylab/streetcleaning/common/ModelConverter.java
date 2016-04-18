package it.smartcommunitylab.streetcleaning.common;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;

import it.smartcommunitylab.streetcleaning.bean.PointBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.model.Point;
import it.smartcommunitylab.streetcleaning.model.Street;


public class ModelConverter {

	private static final Logger logger = Logger.getLogger(ModelConverter.class);
	private static ObjectMapper mapper;

	static {
		mapper = new ObjectMapper();
		mapper.configure(
				org.codehaus.jackson.map.DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,
				false);
	}

	public static <T> T convert(Object o, Class<T> javaClass) {
		return mapper.convertValue(o, javaClass);
	}
	
	public Street convertStreetBeanToStreet(StreetBean street){
		Street s = new Street();
		s.setCode(street.getCode());
		s.setName(street.getName());
		s.setDescription(street.getDescription());
		Point pb = ModelConverter.convert(s.getCentralCoords(), Point.class);
		s.setCentralCoords(pb);
		s.setPolyline(street.getPolyline());
		return s;
	}
	

}