package it.smartcommunitylab.streetcleaning.model;

import java.io.Serializable;

public class Point implements Serializable {

	private static final long serialVersionUID = 2136372501250564998L;
	private double lat;
	private double lng;
	
	public double getLat() {
		return lat;
	}
	
	public double getLng() {
		return lng;
	}
	
	public void setLat(double lat) {
		this.lat = lat;
	}
	
	public void setLng(double lng) {
		this.lng = lng;
	}
	
}
