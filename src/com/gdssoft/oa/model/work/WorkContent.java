package com.gdssoft.oa.model.work;

import java.util.Date;
import com.gdssoft.core.model.BaseModel;

public class WorkContent extends BaseModel{

	protected Long id;
	protected String name;
	protected String descript;
	protected String deptid;
	protected String deptname;
	protected Date limitdate;
	protected String userid;
	protected String username;
	protected Long orderid;
	protected Date createtime;
	protected Integer status;
	protected Integer type;
	protected Long createuser;
    protected java.util.Set workFiles = new java.util.HashSet();
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescript() {
		return descript;
	}
	public void setDescript(String descript) {
		this.descript = descript;
	}
	public String getDeptid() {
		return deptid;
	}
	public void setDeptid(String deptid) {
		this.deptid = deptid;
	}
	public String getDeptname() {
		return deptname;
	}
	public void setDeptname(String deptname) {
		this.deptname = deptname;
	}
	public Date getLimitdate() {
		return limitdate;
	}
	public void setLimitdate(Date limitdate) {
		this.limitdate = limitdate;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Long getOrderid() {
		return orderid;
	}
	public void setOrderid(Long orderid) {
		this.orderid = orderid;
	}
	public Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Long getCreateuser() {
		return createuser;
	}
	public void setCreateuser(Long createuser) {
		this.createuser = createuser;
	}
	public java.util.Set getWorkFiles() {
		return workFiles;
	}
	public void setWorkFiles(java.util.Set workFiles) {
		this.workFiles = workFiles;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	
}
