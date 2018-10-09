package com.gdssoft.oa.model.out;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;


public class OutPersonAppUser  {
	OutPerson outPerson;
	AppUser appUser;
	Department department;
	public OutPerson getOutPerson() {
		return outPerson;
	}
	public void setOutPerson(OutPerson outPerson) {
		this.outPerson = outPerson;
	}
	public AppUser getAppUser() {
		return appUser;
	}
	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	
	
}
