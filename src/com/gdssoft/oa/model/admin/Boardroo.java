package com.gdssoft.oa.model.admin;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * Boardroo Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class Boardroo extends com.gdssoft.core.model.BaseModel {

    protected Long roomId;
	protected String code;
	protected String roomname;
	protected String roomdesc;
	protected Short containnum;
	protected String location;
	protected Short projector;
	protected Short status;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected String telphone;
	protected String roomType;
	protected String manageOrg;
	protected String roomComment;

	transient protected java.util.Set confRoomEquips = new java.util.HashSet();
	protected java.util.Set conferences = new java.util.HashSet();
	
	protected List<Conference> confs = new ArrayList<Conference>();
	
	/**
	 * Default Empty Constructor for class Boardroo
	 */
	public Boardroo () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class Boardroo
	 */
	public Boardroo (
		 Long in_roomid
        ) {
		this.setRoomId(in_roomid);
    }


	public java.util.Set getConfRoomEquips () {
		return confRoomEquips;
	}	
	
	public void setConfRoomEquips (java.util.Set in_confRoomEquips) {
		this.confRoomEquips = in_confRoomEquips;
	}

	public java.util.Set getConferences () {
		return conferences;
	}	
	
	public void setConferences (java.util.Set in_conferences) {
		this.conferences = in_conferences;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="roomid" type="java.lang.Long" generator-class="native"
	 */
	public Long getRoomId() {
		return this.roomId;
	}
	
	/**
	 * Set the roomid
	 */	
	public void setRoomId(Long aValue) {
		this.roomId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CODE" type="java.lang.String" length="30" not-null="false" unique="false"
	 */
	public String getCode() {
		return this.code;
	}
	
	/**
	 * Set the code
	 */	
	public void setCode(String aValue) {
		this.code = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="roomname" type="java.lang.String" length="50" not-null="true" unique="false"
	 */
	public String getRoomname() {
		return this.roomname;
	}
	
	/**
	 * Set the roomname
	 * @spring.validator type="required"
	 */	
	public void setRoomname(String aValue) {
		this.roomname = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="roomdesc" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getRoomdesc() {
		return this.roomdesc;
	}
	
	/**
	 * Set the roomdesc
	 */	
	public void setRoomdesc(String aValue) {
		this.roomdesc = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="containnum" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getContainnum() {
		return this.containnum;
	}
	
	/**
	 * Set the containnum
	 * @spring.validator type="required"
	 */	
	public void setContainnum(Short aValue) {
		this.containnum = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="LOCATION" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getLocation() {
		return this.location;
	}
	
	/**
	 * Set the location
	 */	
	public void setLocation(String aValue) {
		this.location = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="PROJECTOR" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getProjector() {
		return this.projector;
	}
	
	/**
	 * Set the projector
	 * @spring.validator type="required"
	 */	
	public void setProjector(Short aValue) {
		this.projector = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="STATUS" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getStatus() {
		return this.status;
	}
	
	/**
	 * Set the status
	 * @spring.validator type="required"
	 */	
	public void setStatus(Short aValue) {
		this.status = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getCreateDate() {
		return this.createDate;
	}
	
	/**
	 * Set the createDate
	 */	
	public void setCreateDate(java.util.Date aValue) {
		this.createDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CREATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getCreateBy() {
		return this.createBy;
	}
	
	/**
	 * Set the createBy
	 */	
	public void setCreateBy(String aValue) {
		this.createBy = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getUpdateDate() {
		return this.updateDate;
	}
	
	/**
	 * Set the updateDate
	 */	
	public void setUpdateDate(java.util.Date aValue) {
		this.updateDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="UPDATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUpdateBy() {
		return this.updateBy;
	}
	
	/**
	 * Set the updateBy
	 */	
	public void setUpdateBy(String aValue) {
		this.updateBy = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof Boardroo)) {
			return false;
		}
		Boardroo rhs = (Boardroo) object;
		return new EqualsBuilder()
				.append(this.roomId, rhs.roomId)
				.append(this.code, rhs.code)
				.append(this.roomname, rhs.roomname)
				.append(this.roomdesc, rhs.roomdesc)
				.append(this.containnum, rhs.containnum)
				.append(this.location, rhs.location)
				.append(this.projector, rhs.projector)
				.append(this.status, rhs.status)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.roomId) 
				.append(this.code) 
				.append(this.roomname) 
				.append(this.roomdesc) 
				.append(this.containnum) 
				.append(this.location) 
				.append(this.projector) 
				.append(this.status) 
				.append(this.createDate) 
				.append(this.createBy) 
				.append(this.updateDate) 
				.append(this.updateBy)
				.append(this.confs) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("roomId", this.roomId) 
				.append("code", this.code) 
				.append("roomname", this.roomname) 
				.append("roomdesc", this.roomdesc) 
				.append("containnum", this.containnum) 
				.append("location", this.location) 
				.append("projector", this.projector) 
				.append("status", this.status) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}

	public String getTelphone() {
		return telphone;
	}

	public void setTelphone(String telphone) {
		this.telphone = telphone;
	}

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	public String getManageOrg() {
		return manageOrg;
	}

	public void setManageOrg(String manageOrg) {
		this.manageOrg = manageOrg;
	}

	public String getRoomComment() {
		return roomComment;
	}

	public void setRoomComment(String roomComment) {
		this.roomComment = roomComment;
	}

	public List<Conference> getConfs() {
		return confs;
	}

	public void setConfs(List<Conference> confs) {
		this.confs = confs;
	}



}
