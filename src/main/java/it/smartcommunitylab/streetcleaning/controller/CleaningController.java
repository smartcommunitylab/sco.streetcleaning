package it.smartcommunitylab.streetcleaning.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.storage.RepositoryManager;

@RestController
@RequestMapping("/rest")
public class CleaningController {
	private static final transient Logger logger = LoggerFactory.getLogger(CleaningController.class);
	
	@Autowired
	private RepositoryManager storage;
	
	@GetMapping("/ping")
	public @ResponseBody
	String ping() {
		return "PONG";
	}

	@GetMapping("/street")
	public @ResponseBody List<CalendarDataBean> getCleanedDays(@RequestParam(required=false) String streetName) throws Exception {
		/*if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}*/
		List<CalendarDataBean> cleaningDays = storage.getCleaningDaysFromStreet(streetName);
		return cleaningDays;
	}
	
	@GetMapping("/day")
	public @ResponseBody List<CalendarDataBean> getCleanedStreets(@RequestParam(required=false) String daymillis,
			@RequestParam(required=false) String startingtime, @RequestParam(required=false) String endingtime) throws Exception {
		/*if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}*/
		Long day_millis = null;
		Long starting_time = null;
		Long ending_time = null;
		if(StringUtils.hasText(daymillis)){
			day_millis = Long.parseLong(daymillis);
		} else if(StringUtils.hasText(startingtime) && StringUtils.hasText(endingtime)){
			starting_time = Long.parseLong(startingtime);
			ending_time = Long.parseLong(endingtime);
		} else {
			day_millis = System.currentTimeMillis();
		}
		List<CalendarDataBean> cleaningDays = storage.getCleanedStreetsInDay(day_millis, starting_time, ending_time);
		return cleaningDays;
	}
	
	@GetMapping("/next")
	public @ResponseBody List<CalendarDataBean> getNextCleanedStreets(@RequestParam(required=false) String daymillis) throws Exception {

		Long day_millis = null;

		if(StringUtils.hasText(daymillis)){
			day_millis = Long.parseLong(daymillis);
		} else {
			day_millis = System.currentTimeMillis();
		}
		List<CalendarDataBean> cleaningDays = storage.getNextCleanedStreetsInDay(day_millis);
		return cleaningDays;
	}
	
	
	@GetMapping("/search")
	public @ResponseBody List<StreetBean> searchStreets(@RequestParam(required=true) String searchText) throws Exception {

		List<StreetBean> searchStreet = new ArrayList<StreetBean>();
		
		searchStreet = storage.searchStreet(searchText);
		
		return searchStreet;
	}
	
}
	
