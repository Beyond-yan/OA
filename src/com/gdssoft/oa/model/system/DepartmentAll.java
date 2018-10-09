package com.gdssoft.oa.model.system;
/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/


import com.google.gson.annotations.Expose;
import com.gdssoft.core.model.BaseModel;

public class DepartmentAll extends BaseModel {
	private static final long serialVersionUID =1L;
	@Expose
	private Long depId;
	@Expose
	private String depName;
	@Expose
	private String depDesc;
	@Expose
	private Integer depLevel;
	@Expose
	private Long parentId;
	@Expose
	private String path;
	
	@Expose
	private AppUser appUser;
	
	private String depCode;
	
	private String parentDepCode;
	
	private String eamDepCode;

	private String organization;
	
	private String domain;
	
	private String depUnitCode;
	
	private Long departmentLevel;
	
	private Integer isExternal;
	
	private Long schemaId;
	
	
	public Long getSchemaId() {
		return schemaId;
	}

	public void setSchemaId(Long schemaId) {
		this.schemaId = schemaId;
	}

	public Integer getIsExternal() {
		return isExternal;
	}

	public void setIsExternal(Integer isExternal) {
		this.isExternal = isExternal;
	}

	public DepartmentAll() {

	}

	public DepartmentAll(Long depId) {
         this.setDepId(depId);
	}

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

	public String getDepDesc() {
		return depDesc;
	}

	public void setDepDesc(String depDesc) {
		this.depDesc = depDesc;
	}

	public Integer getDepLevel() {
		return depLevel;
	}

	public void setDepLevel(Integer depLevel) {
		this.depLevel = depLevel;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}

	public String getDepCode() {
		return depCode;
	}

	public void setDepCode(String depCode) {
		this.depCode = depCode;
	}

	public String getParentDepCode() {
		return parentDepCode;
	}

	public void setParentDepCode(String parentDepCode) {
		this.parentDepCode = parentDepCode;
	}


	public String getEamDepCode() {
		return eamDepCode;
	}

	public void setEamDepCode(String eamDepCode) {
		this.eamDepCode = eamDepCode;
	}

	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getDepUnitCode() {
		return depUnitCode;
	}

	public void setDepUnitCode(String depUnitCode) {
		this.depUnitCode = depUnitCode;
	}

	public Long getDepartmentLevel() {
		return departmentLevel;
	}

	public void setDepartmentLevel(Long departmentLevel) {
		this.departmentLevel = departmentLevel;
	}

	public void setDepartment(Department department,Long schemaId){
		this.depId = department.getDepId();
		this.depName = department.getDepName();
		this.depDesc = department.getDepDesc();
		this.depLevel = department.getDepLevel();
		this.parentId = department.getParentId();
		this.path = department.getPath();
		this.appUser = department.getAppUser();
		this.depCode = department.getDepCode();
		this.parentDepCode = department.getParentDepCode();
		this.eamDepCode = department.getEamDepCode();
		this.organization = department.getOrganization();
		this.domain = department.getDomain();
		this.depUnitCode = department.getDepUnitCode();
		this.departmentLevel = department.getDepartmentLevel();
		this.isExternal = department.getIsExternal();
		this.schemaId = schemaId;
	}

}
