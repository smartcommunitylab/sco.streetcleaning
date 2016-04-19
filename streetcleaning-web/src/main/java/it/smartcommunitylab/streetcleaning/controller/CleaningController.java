package it.smartcommunitylab.streetcleaning.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.storage.RepositoryManager;

@Controller
public class CleaningController {
	private static final transient Logger logger = LoggerFactory.getLogger(CleaningController.class);
	
	@Autowired
	private RepositoryManager storage;
	
	@RequestMapping(method = RequestMethod.GET, value = "/ping")
	public @ResponseBody
	String ping(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		return "PONG";
	}

	@RequestMapping(value = "/rest/street", method = RequestMethod.GET)
	public @ResponseBody List<CalendarDataBean> getCleanedDays(@RequestParam(required=false) String streetName, 
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		/*if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}*/
		List<CalendarDataBean> cleaningDays = storage.getCleaningDaysFromStreet(streetName);
		return cleaningDays;
	}
	
	@RequestMapping(value = "/rest/day", method = RequestMethod.GET)
	public @ResponseBody List<CalendarDataBean> getCleanedStreets(@RequestParam(required=false) String daymillis,
			@RequestParam(required=false) String startingtime, @RequestParam(required=false) String endingtime,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		/*if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}*/
		Long day_millis = null;
		Long starting_time = null;
		Long ending_time = null;
		if(daymillis != null && daymillis.compareTo("") != 0){
			day_millis = Long.parseLong(daymillis);
		} else if((startingtime != null && startingtime.compareTo("") != 0) && (endingtime != null && endingtime.compareTo("") != 0)){
			starting_time = Long.parseLong(startingtime);
			ending_time = Long.parseLong(endingtime);
		} else {
			logger.error("Exception in service invoke: insert daymillis or starting and ending time");
		}
		List<CalendarDataBean> cleaningDays = storage.getCleanedStreetsInDay(day_millis, starting_time, ending_time);
		return cleaningDays;
	}
	
	@RequestMapping(value = "/rest/search", method = RequestMethod.GET)
	public @ResponseBody List<StreetBean> searchStreets(@RequestParam(required=true) String searchText,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		List<StreetBean> searchStreet = new ArrayList<StreetBean>();
		
		searchStreet = storage.searchStreet(searchText);
		
		return searchStreet;
	}
	
}
	
