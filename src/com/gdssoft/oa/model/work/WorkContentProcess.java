package com.gdssoft.oa.model.work;

import java.util.Date;

import com.gdssoft.core.model.BaseModel;

public class WorkContentProcess extends BaseModel{

	protected Long id;
	protected Long workContentId;
	protected String content;
	protected Date createtime;
	protected String createuser;
    protected java.util.Set processFiles = new java.util.HashSet();
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getWorkContentId() {
		return workContentId;
	}
	public void setWorkContentId(Long workContentId) {
		this.workContentId = workContentId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	public String getCreateuser() {
		return createuser;
	}
	public void setCreateuser(String createuser) {
		this.createuser = createuser;
	}
	public java.util.Set getProcessFiles() {
		return processFiles;
	}
	public void setProcessFiles(java.util.Set processFiles) {
		this.processFiles = processFiles;
	}
	
}
