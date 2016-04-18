package it.smartcommunitylab.streetcleaning.storage;

import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.common.ModelConverter;
import it.smartcommunitylab.streetcleaning.exception.StorageException;
import it.smartcommunitylab.streetcleaning.model.CleaningCal;
import it.smartcommunitylab.streetcleaning.model.Street;
import it.smartcommunitylab.streetcleaning.model.Version;
import it.smartcommunitylab.streetcleaning.security.DataSetInfo;
import it.smartcommunitylab.streetcleaning.security.Token;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

public class RepositoryManager {
	private static final transient Logger logger = LoggerFactory.getLogger(RepositoryManager.class);
	
	private MongoTemplate mongoTemplate;
	private String defaultLang;
	
	public RepositoryManager(MongoTemplate template, String defaultLang) {
		this.mongoTemplate = template;
		this.defaultLang = defaultLang;
	}
	
	public String getDefaultLang() {
		return defaultLang;
	}

	public Token findTokenByToken(String token) {
		Query query = new Query(new Criteria("token").is(token));
		Token result = mongoTemplate.findOne(query, Token.class);
		return result;
	}
	
	public List<DataSetInfo> getDataSetInfo() {
		List<DataSetInfo> result = mongoTemplate.findAll(DataSetInfo.class);
		return result;
	}		
	
	public void saveDataSetInfo(DataSetInfo dataSetInfo) {
		Query query = new Query(new Criteria("ownerId").is(dataSetInfo.getOwnerId()));
		DataSetInfo appInfoDB = mongoTemplate.findOne(query, DataSetInfo.class);
		if (appInfoDB == null) {
			mongoTemplate.save(dataSetInfo);
		} else {
			Update update = new Update();
			update.set("password", dataSetInfo.getPassword());
			update.set("token", dataSetInfo.getToken());
			mongoTemplate.updateFirst(query, update, DataSetInfo.class);
		}
	}
	
	public void saveAppToken(String name, String token) {
		Query query = new Query(new Criteria("name").is(name));
		Token tokenDB = mongoTemplate.findOne(query, Token.class);
		if(tokenDB == null) {
			Token newToken = new Token();
			newToken.setToken(token);
			newToken.setName(name);
			newToken.getPaths().add("/api");
			mongoTemplate.save(newToken);
		} else {
			Update update = new Update();
			update.set("token", token);
			mongoTemplate.updateFirst(query, update, Token.class);
		}
	}
	
	public List<?> findData(Class<?> entityClass, Criteria criteria, Sort sort, String ownerId)
			throws ClassNotFoundException {
		Query query = null;
		if (criteria != null) {
			query = new Query(new Criteria("ownerId").is(ownerId).andOperator(criteria));
		} else {
			query = new Query(new Criteria("ownerId").is(ownerId));
		}
		if (sort != null) {
			query.with(sort);
		}
		query.limit(5000);
		List<?> result = mongoTemplate.find(query, entityClass);
		return result;
	}

	public <T> T findOneData(Class<T> entityClass, Criteria criteria, String ownerId)
			throws ClassNotFoundException {
		Query query = null;
		if (criteria != null) {
			query = new Query(new Criteria("ownerId").is(ownerId).andOperator(criteria));
		} else {
			query = new Query(new Criteria("ownerId").is(ownerId));
		}
		T result = mongoTemplate.findOne(query, entityClass);
		return result;
	}

	private String generateObjectId() {
		return UUID.randomUUID().toString();
	}
	
	public StreetBean saveStreet(StreetBean s) throws Exception {
		Street st = ModelConverter.convert(s, Street.class);
		mongoTemplate.save(st);
		return s;
	}
	
	public CalendarDataBean saveCalendar(CalendarDataBean c) throws Exception {
		CleaningCal cc = ModelConverter.convert(c, CleaningCal.class);
		mongoTemplate.save(cc);
		return c;
	}
	
	public Version saveDataVersion(Version v) throws Exception {
		mongoTemplate.save(v);
		return v;
	}
	
	public List<StreetBean> getAllStreet() throws Exception {
		List<StreetBean> allStreetBean = new ArrayList<StreetBean>();
		List<Street> allStreet = mongoTemplate.findAll(Street.class);
		for(Street s:allStreet){
			StreetBean sb = new StreetBean();
			sb.setCode(s.getCode());
			sb.setName(s.getName());
			sb.setDescription(s.getDescription());
			sb.setPolyline(s.getPolyline());
			allStreetBean.add(sb);
		}
		return allStreetBean;
	}
	
	// First method: used to retrieve the street data from the street name and the period to check
	/*public List<StreetBean> getStreetData(String streetName, Long startingPeriod, Long endingPeriod){
		Query query = null;
		Criteria criteria = new Criteria("streetName").is(streetName).andOperator(
				new Criteria("cleaningDay").in(startingPeriod,endingPeriod));
		query = new Query(criteria);
		return mongoTemplate.find(query, StreetBean.class);
	}*/
	
	// First method: used to retrieve the street data from the period to check
	public List<CalendarDataBean> getCleanedStreetsInDay(Long day, Long startingTime, Long endingTime){
		List<CalendarDataBean> calendarStreetList = new ArrayList<CalendarDataBean>();
		Query query = null;
		if(startingTime != null && endingTime != null){
			query = new Query(new Criteria("startingTime").ne("0").andOperator(new Criteria("endingTime").ne("0")).andOperator(
					new Criteria("startingTime").gte(startingTime).andOperator(new Criteria("endingTime").lte(endingTime))).orOperator(
					new Criteria("cleaningDay").in(startingTime,endingTime)));
		} else {
			query = new Query(new Criteria("cleaningDay").is(day));
		}
		List<CleaningCal> tmpCleaningStreet = mongoTemplate.find(query, CleaningCal.class);
		for(CleaningCal cc:tmpCleaningStreet){
			CalendarDataBean cdb = new CalendarDataBean();
			cdb.setStreetName(cc.getStreetName());
			cdb.setStreetCode(cc.getStreetCode());
			cdb.setCleaningDay(cc.getCleaningDay());
			cdb.setStartingTime(cc.getStartingTime());
			cdb.setEndingTime(cc.getEndingTime());
			cdb.setNotes(cc.getNotes());
			cdb.setPolylines(cc.getPolylines());
			calendarStreetList.add(cdb);
		}
		return mongoTemplate.find(query, CalendarDataBean.class);
	}
	
	// Second method: used to retrieve the cleaning period data from the street name
	public List<CalendarDataBean> getCleaningDaysFromStreet(String streetName){
		List<CalendarDataBean> calendarStreetList = new ArrayList<CalendarDataBean>();
		Query query = null;
		if(streetName != null){
			query = new Query(new Criteria("streetName").is(streetName));
		}
		List<CleaningCal> tmpCleaningCal = mongoTemplate.find(query, CleaningCal.class);
		for(CleaningCal cc:tmpCleaningCal){
			CalendarDataBean cdb = new CalendarDataBean();
			cdb.setStreetName(cc.getStreetName());
			cdb.setStreetCode(cc.getStreetCode());
			cdb.setCleaningDay(cc.getCleaningDay());
			cdb.setStartingTime(cc.getStartingTime());
			cdb.setEndingTime(cc.getEndingTime());
			cdb.setNotes(cc.getNotes());
			cdb.setPolylines(cc.getPolylines());
			calendarStreetList.add(cdb);
		}
		return calendarStreetList;
	}
	
	// Third method: used to retrieve the actual version of the data
	public Version getDataVersion(String version) throws Exception {
		Version v = null;
		if(version != null){
			Query query = new Query(new Criteria("version").is(version));
			v = mongoTemplate.findOne(query, Version.class);
		} else {
			List<Version> allVersion = mongoTemplate.findAll(Version.class);
			Version tmp_Vers = allVersion.get(0);
			for(Version ve:allVersion){
				if(ve.getUpdate_time() > tmp_Vers.getUpdate_time()){
					tmp_Vers = ve;
				}
			}
			v = tmp_Vers;
		}
		return v;
	}

}
