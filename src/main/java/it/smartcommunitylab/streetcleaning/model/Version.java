package it.smartcommunitylab.streetcleaning.model;

import java.io.Serializable;

public class Version implements Serializable {

	private static final long serialVersionUID = 5368584368264126300L;
	private String version;
	private Long update_time;
	
	public String getVersion() {
		return version;
	}
	
	public Long getUpdate_time() {
		return update_time;
	}
	
	public void setVersion(String version) {
		this.version = version;
	}
	
	public void setUpdate_time(Long update_time) {
		this.update_time = update_time;
	}
	
}
