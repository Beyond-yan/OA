package com.gdssoft.oa.model.leaderActivities;

import java.util.Date;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;
import com.gdssoft.core.model.BaseModel;
import com.gdssoft.oa.model.system.AppUser;
import com.google.gson.annotations.Expose;

public class LeaderActivities extends BaseModel {
	protected Long activeId;
	protected String activeName;
	protected String activeDesc;
	protected Date startTime;
	protected Date endTime;
	protected String displayType;
	protected String createUser;
	protected Date createDate;
	protected String updateUser;
	protected Date updateDate;
	@Expose
	protected String sgDate;
	protected String sdDate;
	protected AppUser appUser;
	protected Integer timeType;
	protected Integer timeNumber;
	protected Integer dataSources;

	public Integer getDataSources() {
		return dataSources;
	}

	public void setDataSources(Integer dataSources) {
		this.dataSources = dataSources;
	}

	public AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}

	public String getSgDate() {
		return sgDate;
	}

	public String getSdDate() {
		return sdDate;
	}

	public void setSdDate(String sdDate) {
		this.sdDate = sdDate;
	}

	public void setSgDate(String sgDate) {
		this.sgDate = sgDate;
	}

	public LeaderActivities() {
		super();
	}

	public LeaderActivities(Long activeId) {
		this.setActiveId(activeId);
	}

	public Long getActiveId() {
		return activeId;
	}

	public void setActiveId(Long activeId) {
		this.activeId = activeId;
	}

	public String getActiveName() {
		return activeName;
	}

	public void setActiveName(String activeName) {
		this.activeName = activeName;
	}

	public String getActiveDesc() {
		return activeDesc;
	}

	public void setActiveDesc(String activeDesc) {
		this.activeDesc = activeDesc;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getDisplayType() {
		return displayType;
	}

	public void setDisplayType(String displayType) {
		this.displayType = displayType;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Integer getTimeType() {
		return timeType;
	}

	public void setTimeType(Integer timeType) {
		this.timeType = timeType;
	}

	public Integer getTimeNumber() {
		return timeNumber;
	}

	public void setTimeNumber(Integer timeNumber) {
		this.timeNumber = timeNumber;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof LeaderActivities)) {
			return false;
		}
		LeaderActivities rhs = (LeaderActivities) object;
		return new EqualsBuilder().append(this.activeId, rhs.activeId)
				.append(this.activeName, rhs.activeName)
				.append(this.activeDesc, rhs.activeDesc)
				.append(this.startTime, rhs.startTime)
				.append(this.endTime, rhs.endTime)
				.append(this.displayType, rhs.displayType)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
				.append(this.updateUser, rhs.updateUser)
				.append(this.updateDate, rhs.updateDate)
				.append(this.timeType, rhs.timeType)
				.append(this.timeNumber, rhs.timeNumber).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.activeId)
				.append(this.activeName).append(this.activeDesc)
				.append(this.startTime).append(this.endTime)
				.append(this.displayType).append(this.createUser)
				.append(this.createDate).append(this.updateUser)
				.append(this.updateDate).append(this.timeType)
				.append(this.timeNumber).toHashCode();
	}
	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("activeId", this.activeId)
				.append("activeName", this.activeName)
				.append("activeDesc", this.activeDesc)
				.append("startTime", this.startTime)
				.append("endTime", this.endTime)
				.append("displayType", this.displayType)
				.append("createUser", this.createUser)
				.append("createDate", this.createDate)
				.append("updateUser", this.updateUser)
				.append("updateDate", this.updateDate)
				.append("timeType", this.timeType)
				.append("timeNumber", this.timeNumber).toString();
	}

}
