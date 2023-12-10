package it.smartcommunitylab.streetcleaning.bean;

public class PointBean {
	private double lat;
	private double lng;

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public double getLng() {
		return lng;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}
	
	public PointBean() {
	}

	public PointBean(double lat, double lng) {
		super();
		this.lat = lat;
		this.lng = lng;
	}

}
