package it.smartcommunitylab.streetcleaning.bean;

import java.util.List;

public class CalendarDataBean {

	private String id;
	private String streetName;
	private String streetCode;
	private Long cleaningDay;
	private Long startingTime;
	private Long endingTime;
	private String notes;
	private List<PointBean> centralCoords;
	private List<String> polylines;
	private String lato, tratto;
	private Long stopStartingTime;
	private Long stopEndingTime;

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

	public List<PointBean> getCentralCoords() {
		return centralCoords;
	}

	public void setCentralCoords(List<PointBean> centralCoords) {
		this.centralCoords = centralCoords;
	}

	public CalendarDataBean() {
		// TODO Auto-generated constructor stub
	}

	public CalendarDataBean(String streetName, String streetCode, Long cleaningDay, Long startingTime, Long endingTime,
			String notes, List<PointBean> centralCoords, List<String> polylines) {
		super();
		this.streetName = streetName;
		this.streetCode = streetCode;
		this.cleaningDay = cleaningDay;
		this.startingTime = startingTime;
		this.endingTime = endingTime;
		this.notes = notes;
		this.centralCoords = centralCoords;
		this.polylines = polylines;
	}

	@Override
	public String toString() {
		return "CalendarDataBean [streetName=" + streetName + ", streetCode=" + streetCode + ", cleaningDay="
				+ cleaningDay + ", startingTime=" + startingTime + ", endingTime=" + endingTime + ", notes=" + notes
				+ ", centralCoords=" + centralCoords + ", polylines=" + polylines + "]";
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLato() {
		return lato;
	}

	public void setLato(String lato) {
		this.lato = lato;
	}

	public String getTratto() {
		return tratto;
	}

	public void setTratto(String tratto) {
		this.tratto = tratto;
	}

	public Long getStopStartingTime() {
		return stopStartingTime;
	}

	public void setStopStartingTime(Long stopStartingTime) {
		this.stopStartingTime = stopStartingTime;
	}

	public Long getStopEndingTime() {
		return stopEndingTime;
	}

	public void setStopEndingTime(Long stopEndingTime) {
		this.stopEndingTime = stopEndingTime;
	}

}
