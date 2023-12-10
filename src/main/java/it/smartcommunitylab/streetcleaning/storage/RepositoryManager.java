package it.smartcommunitylab.streetcleaning.storage;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.common.ModelConverter;
import it.smartcommunitylab.streetcleaning.common.Utils;
import it.smartcommunitylab.streetcleaning.model.CleaningCal;
import it.smartcommunitylab.streetcleaning.model.Street;
import it.smartcommunitylab.streetcleaning.model.Version;

@Component
public class RepositoryManager {

	private final MongoTemplate mongoTemplate;

	public RepositoryManager(MongoTemplate template) {
		this.mongoTemplate = template;
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
		for (Street s : allStreet) {
			StreetBean sb = new StreetBean();
			sb.setCode(s.getCode());
			sb.setName(s.getName());
			sb.setDescription(s.getDescription());
			sb.setCentralCoords(s.getCentralCoords());
			sb.setPolyline(s.getPolyline());
			allStreetBean.add(sb);
		}
		return allStreetBean;
	}

	// First method: used to retrieve the street data from the street name and
	// the period to check
	/*
	 * public List<StreetBean> getStreetData(String streetName, Long
	 * startingPeriod, Long endingPeriod){ Query query = null; Criteria criteria
	 * = new Criteria("streetName").is(streetName).andOperator( new
	 * Criteria("cleaningDay").in(startingPeriod,endingPeriod)); query = new
	 * Query(criteria); return mongoTemplate.find(query, StreetBean.class); }
	 */

	// First method: used to retrieve the street data from the period to check
	public List<CalendarDataBean> getCleanedStreetsInDay(Long day, Long startingTime, Long endingTime) {
		
		// fix of setting time to midnight reported at helinski.
//		java.util.Date startTime = new java.util.Date(day);
		java.util.Date startTime  = Utils.getStartOfDay(day);
		day = startTime.getTime();
		
		List<CalendarDataBean> calendarStreetList = new ArrayList<CalendarDataBean>();
		Query query = null;
		if (startingTime != null && endingTime != null) {
			query = new Query(new Criteria("startingTime").ne("0").andOperator(new Criteria("endingTime").ne("0"))
					.andOperator(new Criteria("startingTime").gte(startingTime)
							.andOperator(new Criteria("endingTime").lte(endingTime)))
					.orOperator(new Criteria("cleaningDay").in(startingTime, endingTime)));
		} else {
			query = new Query(new Criteria("cleaningDay").is(day));
		}
		List<CleaningCal> tmpCleaningStreet = mongoTemplate.find(query, CleaningCal.class);
		for (CleaningCal cc : tmpCleaningStreet) {
			CalendarDataBean cdb = new CalendarDataBean();
			cdb.setId(cc.getId());
			cdb.setStreetName(cc.getStreetName());
			cdb.setStreetCode(cc.getStreetCode());
			cdb.setCleaningDay(cc.getCleaningDay());
			cdb.setStartingTime(cc.getStartingTime());
			cdb.setEndingTime(cc.getEndingTime());
			cdb.setNotes(cc.getNotes());
			cdb.setCentralCoords(cc.getCentralCoords());
			cdb.setPolylines(cc.getPolylines());
			cdb.setTratto(cc.getTratto());
			cdb.setLato(cc.getLato());
			cdb.setStopEndingTime(cc.getStopEndingTime());
			cdb.setStopStartingTime(cc.getStopStartingTime());
			calendarStreetList.add(cdb);
		}
		return calendarStreetList;
	}


	/**
	 * @param day_millis
	 * @return
	 */
	public List<CalendarDataBean> getNextCleanedStreetsInDay(Long day) {
		java.util.Date startTime  = Utils.getStartOfDay(day);
		day = startTime.getTime();
		
		List<CalendarDataBean> calendarStreetList = new ArrayList<CalendarDataBean>();
		Query query = Query.query(Criteria.where("cleaningDay").gte(day));
		query = query.limit(1);
		query = query.with(Sort.by("cleaningDay"));
		
		CleaningCal tmpCleaningStreet = mongoTemplate.findOne(query, CleaningCal.class);
		if (tmpCleaningStreet == null) return Collections.emptyList();
		
		day = tmpCleaningStreet.getCleaningDay();
		query = Query.query(Criteria.where("cleaningDay").in(day, day + 23*60*60*1000));

		List<CleaningCal> list = mongoTemplate.find(query, CleaningCal.class);
		for (CleaningCal cc : list) {
			CalendarDataBean cdb = new CalendarDataBean();
			cdb.setId(cc.getId());
			cdb.setStreetName(cc.getStreetName());
			cdb.setStreetCode(cc.getStreetCode());
			cdb.setCleaningDay(cc.getCleaningDay());
			cdb.setStartingTime(cc.getStartingTime());
			cdb.setEndingTime(cc.getEndingTime());
			cdb.setNotes(cc.getNotes());
			cdb.setCentralCoords(cc.getCentralCoords());
			cdb.setPolylines(cc.getPolylines());
			cdb.setTratto(cc.getTratto());
			cdb.setLato(cc.getLato());
			cdb.setStopEndingTime(cc.getStopEndingTime());
			cdb.setStopStartingTime(cc.getStopStartingTime());
			calendarStreetList.add(cdb);
		}
		return calendarStreetList;
	}
	
	// Second method: used to retrieve the cleaning period data from the street
	// name
	public List<CalendarDataBean> getCleaningDaysFromStreet(String streetName) {
		List<CalendarDataBean> calendarStreetList = new ArrayList<CalendarDataBean>();
		Query query = null;
		if (streetName != null) {
			query = new Query(new Criteria("streetName").is(streetName));
		}
		List<CleaningCal> tmpCleaningCal = query != null ? mongoTemplate.find(query, CleaningCal.class) : mongoTemplate.findAll(CleaningCal.class);
		for (CleaningCal cc : tmpCleaningCal) {
			CalendarDataBean cdb = new CalendarDataBean();
			cdb.setId(cc.getId());
			cdb.setStreetName(cc.getStreetName());
			cdb.setStreetCode(cc.getStreetCode());
			cdb.setCleaningDay(cc.getCleaningDay());
			cdb.setStartingTime(cc.getStartingTime());
			cdb.setEndingTime(cc.getEndingTime());
			cdb.setNotes(cc.getNotes());
			cdb.setCentralCoords(cc.getCentralCoords());
			cdb.setPolylines(cc.getPolylines());
			cdb.setTratto(cc.getTratto());
			cdb.setLato(cc.getLato());
			cdb.setStopEndingTime(cc.getStopEndingTime());
			cdb.setStopStartingTime(cc.getStopStartingTime());
			calendarStreetList.add(cdb);
		}
		return calendarStreetList;
	}

	// Third method: used to retrieve the actual version of the data
	public Version getDataVersion(String version) throws Exception {
		Version v = null;
		if (version != null) {
			Query query = new Query(new Criteria("version").is(version));
			v = mongoTemplate.findOne(query, Version.class);
		} else {
			List<Version> allVersion = mongoTemplate.findAll(Version.class);
			Version tmp_Vers = allVersion.get(0);
			for (Version ve : allVersion) {
				if (ve.getUpdate_time() > tmp_Vers.getUpdate_time()) {
					tmp_Vers = ve;
				}
			}
			v = tmp_Vers;
		}
		return v;
	}

	public List<StreetBean> searchStreet(String searchText) {

		List<StreetBean> searchStreet = new ArrayList<StreetBean>();
		List<String> streetNames = new ArrayList<String>();
		Query query = null;
		if (searchText != null) {
			query = new Query(new Criteria("streetName")
					.regex(Pattern.compile(".*" + searchText + ".*", Pattern.CASE_INSENSITIVE)));
		}

		for (CleaningCal cal : mongoTemplate.find(query, CleaningCal.class)) {
			if (!streetNames.contains(cal.getStreetName())) {
				streetNames.add(cal.getStreetName());
				StreetBean sb = new StreetBean();
				sb.setCode(cal.getStreetCode());
				sb.setName(cal.getStreetName());
				searchStreet.add(sb);
			}
		}

		return searchStreet;

	}

	public MongoTemplate getMongoTemplate() {
		return mongoTemplate;
	}

	public boolean existStreet(StreetBean sb) {

		Street s = ModelConverter.convert(sb, Street.class);

		Query query = new Query(new Criteria("name").is(s.getName()).and("code").is(s.getCode()));

		Street savedStreet = mongoTemplate.findOne(query, Street.class);

		if (savedStreet != null) {
			return true;
		}

		return false;
	}

	public boolean existCalendar(CalendarDataBean cdb) {

		CleaningCal cal = ModelConverter.convert(cdb, CleaningCal.class);

		Query query = new Query(
				new Criteria("streetName").is(cal.getStreetName()).and("streetCode").is(cal.getStreetCode()));

		CleaningCal savedCal = mongoTemplate.findOne(query, CleaningCal.class);

		if (savedCal != null) {
			return true;
		}

		return false;
	}

    public void cleanCalendars() {
		mongoTemplate.dropCollection(CleaningCal.class);
    }


}
