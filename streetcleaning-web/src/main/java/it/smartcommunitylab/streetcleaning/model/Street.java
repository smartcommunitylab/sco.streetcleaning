package it.smartcommunitylab.streetcleaning.model;

import java.io.Serializable;

public class Street implements Serializable {

	private static final long serialVersionUID = 3811080805564695001L;
	
	private String id;
	private String code;
	private String name;
	private String description;
	private Point centralCoords;
	private String polyline;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

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
	
	public Point getCentralCoords() {
		return centralCoords;
	}

	public void setCentralCoords(Point centralCoords) {
		this.centralCoords = centralCoords;
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

}
