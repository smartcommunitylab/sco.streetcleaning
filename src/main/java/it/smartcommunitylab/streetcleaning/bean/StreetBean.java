package it.smartcommunitylab.streetcleaning.bean;

import java.io.Serializable;
import java.util.List;

public class StreetBean implements Serializable {

	private static final long serialVersionUID = 6406219128455836821L;
	private String id;
	private String code;
	private String name;
	private String description;
	private List<PointBean> centralCoords;
	private List<String> polyline;
	
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
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

	public StreetBean() {
		super();
	}

	public StreetBean(String code, String name, String description, List<PointBean> centralCoords, List<String> polyline) {
		super();
		this.code = code;
		this.name = name;
		this.description = description;
		this.centralCoords = centralCoords;
		this.polyline = polyline;
	}

	@Override
	public String toString() {
		return "StreetBean [id=" + id + ", code=" + code + ", name=" + name + ", description=" + description
				+ ", centralCoords=" + centralCoords + ", polyline=" + polyline + "]";
	}

}
