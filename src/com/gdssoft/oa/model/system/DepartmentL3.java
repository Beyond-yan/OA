package com.gdssoft.oa.model.system;

import java.util.List;

import com.gdssoft.core.model.BaseModel;
import com.google.gson.annotations.Expose;

public class DepartmentL3 extends BaseModel{
	
	private Long depId;
	
	private String depName;
	
	private List<AppUser> Leaders;

	public Long getDepId() {
		return depId;
	}

	public void setDepId(Long depId) {
		this.depId = depId;
	}

	public String getDepName() {
		return depName;
	}

	public void setDepName(String depName) {
		this.depName = depName;
	}

	public List<AppUser> getLeaders() {
		return Leaders;
	}

	public void setLeaders(List<AppUser> leaders) {
		Leaders = leaders;
	}

}
