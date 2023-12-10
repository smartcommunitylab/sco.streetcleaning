package it.smartcommunitylab.streetcleaning.common;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.model.Street;


public class ModelConverter {

	private static ObjectMapper mapper;

	static {
		mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
}

	public static <T> T convert(Object o, Class<T> javaClass) {
		return mapper.convertValue(o, javaClass);
	}
	
	public Street convertStreetBeanToStreet(StreetBean street){
		Street s = new Street();
		s.setCode(street.getCode());
		s.setName(street.getName());
		s.setDescription(street.getDescription());
		s.setCentralCoords(street.getCentralCoords());
		s.setPolyline(street.getPolyline());
		return s;
	}
	

}