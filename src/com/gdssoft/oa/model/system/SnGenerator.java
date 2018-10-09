package com.gdssoft.oa.model.system;


import java.util.Date;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.core.model.BaseModel;

@SuppressWarnings("serial")
public class SnGenerator extends BaseModel {
	protected Long snId;
	protected String snPrefix;
	protected Long snNumber;
	protected Date updateDate;
	public Long getSnId() {
		return snId;
	}
	public void setSnId(Long snId) {
		this.snId = snId;
	}
	public String getSnPrefix() {
		return snPrefix;
	}
	public void setSnPrefix(String snPrefix) {
		this.snPrefix = snPrefix;
	}
	public Long getSnNumber() {
		return snNumber;
	}
	public void setSnNumber(Long snNumber) {
		this.snNumber = snNumber;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	@Override
	public String toString() {
		return new ToStringBuilder(this)
			.append("snPrefix", this.snPrefix) 
			.append("snNumber", this.snNumber)
			.toString();
	}
}
