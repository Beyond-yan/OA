package com.gdssoft.oa.model.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/

import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.system.AppUser;

public class FileSnConfigOrder extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String orderSnName;//生成公文编号的名称
	protected Integer isUsed;//该预约编号是否被使用0：未使用，1：已使用
	protected String createUser;
	protected java.util.Date createDate;
	
	protected FileSnConfig fileSnConfig;
	
	protected Long defId;
	
	protected Long userId;
	
	protected String userName;
	
	protected String flowName;
	
	
	public String getFlowName() {
		return flowName;
	}
	public void setFlowName(String flowName) {
		this.flowName = flowName;
	}
	public FileSnConfig getFileSnConfig() {
		return fileSnConfig;
	}
	public void setFileSnConfig(FileSnConfig fileSnConfig) {
		this.fileSnConfig = fileSnConfig;
	}
	
	public Long getDefId() {
		return defId;
	}
	public void setDefId(Long defId) {
		this.defId = defId;
	}
	
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public String getOrderSnName() {
		return orderSnName;
	}
	public void setOrderSnName(String orderSnName) {
		this.orderSnName = orderSnName;
	}
	public Integer getIsUsed() {
		return isUsed;
	}
	public void setIsUsed(Integer isUsed) {
		this.isUsed = isUsed;
	}
	
	public String getCreateUser() {
		return createUser;
	}
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	public java.util.Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}
	
	
	

}
