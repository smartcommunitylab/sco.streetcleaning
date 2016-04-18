package it.smartcommunitylab.streetcleaning.bean;

import java.io.Serializable;

public class StreetBean implements Serializable {

	private static final long serialVersionUID = 6406219128455836821L;
	private String code;
	private String name;
	private String description;
	private String polyline;
	
	public String getCode() {
		return code;
	}
	
	public String getName() {
		return name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public String getPolyline() {
		return polyline;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setPolyline(String polyline) {
		this.polyline = polyline;
	}

	public StreetBean() {
		super();
	}

	public StreetBean(String code, String name, String description, String polyline) {
		super();
		this.code = code;
		this.name = name;
		this.description = description;
		this.polyline = polyline;
	}

	@Override
	public String toString() {
		return "StreetBean [code=" + code + ", name=" + name + ", description=" + description + ", polyline=" + polyline
				+ "]";
	}

}
