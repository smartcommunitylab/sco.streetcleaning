package it.smartcommunitylab.streetcleaning.bean;

import java.util.List;

public class CalendarDataBean {
	
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

	public CalendarDataBean() {
		// TODO Auto-generated constructor stub
	}

	public CalendarDataBean(String streetName, String streetCode, Long cleaningDay, Long startingTime, Long endingTime,
			String notes, List<String> polylines) {
		super();
		this.streetName = streetName;
		this.streetCode = streetCode;
		this.cleaningDay = cleaningDay;
		this.startingTime = startingTime;
		this.endingTime = endingTime;
		this.notes = notes;
		this.polylines = polylines;
	}

	@Override
	public String toString() {
		return "CalendarDataBean [streetName=" + streetName + ", streetCode=" + streetCode + ", cleaningDay="
				+ cleaningDay + ", startingTime=" + startingTime + ", endingTime=" + endingTime + ", notes=" + notes
				+ ", polylines=" + polylines + "]";
	}
	
	public String toJSON() {
		String polylinesStrings = "[";
		if(polylines != null){
			for(int i = 0; i < polylines.size(); i++){
				polylinesStrings += "\"" + polylines.get(i) + "\",";
			}
			polylinesStrings = polylinesStrings.substring(0, polylinesStrings.length() - 1);
		}
		polylinesStrings += "]";
		return "{\"streetName\": \"" + streetName + "\", \"streetCode\": \"" + streetCode + "\", \"cleaningDay\": "+ cleaningDay + " ,"
				+ "\"startingTime\": " + startingTime + ", \"endingTime\": " + endingTime + ", \"notes\": \"" + notes + "\", "
				+ "\"polylines\": " + polylinesStrings + "}";
	}

}
