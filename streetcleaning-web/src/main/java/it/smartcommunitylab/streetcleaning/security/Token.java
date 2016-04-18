package it.smartcommunitylab.streetcleaning.security;

import java.util.ArrayList;
import java.util.List;

public class Token {
	/** token. **/
	private String token;
	/** created. **/
	private long created;
	/** expiration. **/
	private long expiration;
	/** resources. **/
	private List<String> resources = new ArrayList<String>();
	/** paths. **/
	private List<String> paths = new ArrayList<String>();
	/** name. **/
	private String name;

	public Token() {
	}

	public Token(String token, long created, long expiration,
			List<String> resources, List<String> paths, String name) {
		this.token = token;
		this.created = created;
		this.expiration = expiration;
		this.resources = resources;
		this.paths = paths;
		this.name = name;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public long getCreated() {
		return created;
	}

	public void setCreated(long created) {
		this.created = created;
	}

	public long getExpiration() {
		return expiration;
	}

	public void setExpiration(long expiration) {
		this.expiration = expiration;
	}

	public List<String> getResources() {
		return resources;
	}

	public void setResources(List<String> resources) {
		this.resources = resources;
	}

	public List<String> getPaths() {
		return paths;
	}

	public void setPaths(List<String> paths) {
		this.paths = paths;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
