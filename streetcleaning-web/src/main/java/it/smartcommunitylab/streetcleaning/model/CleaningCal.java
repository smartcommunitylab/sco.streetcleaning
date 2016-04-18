package it.smartcommunitylab.streetcleaning.model;

import java.io.Serializable;
import java.util.List;

public class CleaningCal implements Serializable {
	
	private static final long serialVersionUID = 4724447617770170907L;
	private String streetName;
	private String streetCode;
	private Long cleaningDay;
	private Long startingTime;
	private Long endingTime;
	private String notes;
	private List<String> polylines;
	
	public String getStreetName() {
		return streetName;
	}
	
	public Long getCleaningDay() {
		return cleaningDay;
	}
	
	public Long getStartingTime() {
		return startingTime;
	}
	
	public Long getEndingTime() {
		return endingTime;
	}
	
	public String getNotes() {
		return notes;
	}
	
	public void setStreetName(String streetName) {
		this.streetName = streetName;
	}
	
	public void setCleaningDay(Long cleaningDay) {
		this.cleaningDay = cleaningDay;
	}
	
	public void setStartingTime(Long startingTime) {
		this.startingTime = startingTime;
	}
	
	public void setEndingTime(Long endingTime) {
		this.endingTime = endingTime;
	}
	
	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getStreetCode() {
		return streetCode;
	}

	public List<String> getPolylines() {
		return polylines;
	}

	public void setStreetCode(String streetCode) {
		this.streetCode = streetCode;
	}

	public void setPolylines(List<String> polylines) {
		this.polylines = polylines;
	}

}
