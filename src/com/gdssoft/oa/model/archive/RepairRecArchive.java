package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
/**
 * OdCirPaper Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class RepairRecArchive extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String childDepNames;
	protected String status;
	protected com.gdssoft.oa.model.system.AppUser appUser;
	protected com.gdssoft.oa.model.archive.Archives archives;
	protected com.gdssoft.oa.model.flow.ProDefinition proDefinition;
	protected com.gdssoft.oa.model.system.Department department;
	protected com.gdssoft.oa.model.system.AppRole appRole;

	/**
	 * Default Empty Constructor for class OdCirPaper
	 */
	public RepairRecArchive () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class OdCirPaper
	 */
	public RepairRecArchive (
		 Long id
        ) {
		this.setId(id);
    }

	
	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getChildDepNames() {
		return childDepNames;
	}

	public void setChildDepNames(String childDepNames) {
		this.childDepNames = childDepNames;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public com.gdssoft.oa.model.archive.Archives getArchives() {
		return archives;
	}

	public void setArchives(com.gdssoft.oa.model.archive.Archives archives) {
		this.archives = archives;
	}

	public com.gdssoft.oa.model.flow.ProDefinition getProDefinition() {
		return proDefinition;
	}

	public void setProDefinition(
			com.gdssoft.oa.model.flow.ProDefinition proDefinition) {
		this.proDefinition = proDefinition;
	}

	public com.gdssoft.oa.model.system.Department getDepartment() {
		return department;
	}

	public void setDepartment(com.gdssoft.oa.model.system.Department department) {
		this.department = department;
	}

	public com.gdssoft.oa.model.system.AppRole getAppRole() {
		return appRole;
	}

	public void setAppRole(com.gdssoft.oa.model.system.AppRole appRole) {
		this.appRole = appRole;
	}

}
