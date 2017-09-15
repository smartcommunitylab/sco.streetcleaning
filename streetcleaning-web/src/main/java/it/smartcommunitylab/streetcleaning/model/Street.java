package it.smartcommunitylab.streetcleaning.model;

import java.io.Serializable;
import java.util.List;

import it.smartcommunitylab.streetcleaning.bean.PointBean;

public class Street implements Serializable {

	private static final long serialVersionUID = 3811080805564695001L;
	
	private String id;
	private String code;
	private String name;
	private String description;
	private List<PointBean> centralCoords;
	private List<String> polyline;
	
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
	

	public void setCode(String code) {
		this.code = code;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}

	public List<PointBean> getCentralCoords() {
		return centralCoords;
	}

	public void setCentralCoords(List<PointBean> centralCoords) {
		this.centralCoords = centralCoords;
	}

	public List<String> getPolyline() {
		return polyline;
	}

	public void setPolyline(List<String> polyline) {
		this.polyline = polyline;
	}
	
}
