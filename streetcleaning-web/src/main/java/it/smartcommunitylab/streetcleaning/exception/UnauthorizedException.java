package it.smartcommunitylab.streetcleaning.exception;

public class UnauthorizedException extends Exception {
	private static final long serialVersionUID = 2830818885667911753L;

	public UnauthorizedException() {
		super();
	}

	public UnauthorizedException(String message) {
		super(message);
	}
}
