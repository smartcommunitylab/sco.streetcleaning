package it.smartcommunitylab.streetcleaning.common;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;


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

}