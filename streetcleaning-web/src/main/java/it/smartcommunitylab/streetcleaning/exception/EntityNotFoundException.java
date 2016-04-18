package it.smartcommunitylab.streetcleaning.exception;

public class EntityNotFoundException extends Exception {
	private static final long serialVersionUID = 1932134789170282070L;

	public EntityNotFoundException() {
		super();
	}

	public EntityNotFoundException(String message) {
		super(message);
	}
}
