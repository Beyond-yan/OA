package com.gdssoft.oa.model.system;

import com.google.gson.annotations.Expose;

public class Leader extends com.gdssoft.core.model.BaseModel{
	
    protected Long userId;
	
	protected String username;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
}
