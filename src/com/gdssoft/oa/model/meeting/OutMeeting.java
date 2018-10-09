package com.gdssoft.oa.model.meeting;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.oa.model.system.FileAttach;

/**
 * OutMeeting Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class OutMeeting extends com.gdssoft.core.model.BaseModel {

    protected Long meetingId;
	protected String name;
	protected String host;
	protected String recorder;
	protected java.util.Date recordTime;
	protected String contactPerson;
	protected String contactTel;
	protected java.util.Date holdTime;
	protected String holdLocation;
	protected Short attendType;
	protected String attendLeaders;
	protected String attendOfficers;
	protected String attendOfficeLeaders;
	protected String attendSubDeps;
	protected String holdDep;
	protected String shortDesc;
	protected Long runId;

	protected java.util.Set<FileAttach> docs = new java.util.HashSet<FileAttach>();
	

	/**
	 * Default Empty Constructor for class OutMeeting
	 */
	public OutMeeting () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class OutMeeting
	 */
	public OutMeeting (
		 Long in_meetingId
        ) {
		this.setMeetingId(in_meetingId);
    }

	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}
	public String getAttendSubDeps() {
		return attendSubDeps;
	}

	public void setAttendSubDeps(String attendSubDeps) {
		this.attendSubDeps = attendSubDeps;
	}
	public java.util.Set<FileAttach> getDocs() {
		return docs;
	}

	public void setDocs(java.util.Set<FileAttach> docs) {
		this.docs = docs;
	}

	/**
	 * 	 * @return Long
     * @hibernate.id column="MEETINGID" type="java.lang.Long" generator-class="native"
	 */
	public Long getMeetingId() {
		return this.meetingId;
	}
	
	/**
	 * Set the meetingId
	 */	
	public void setMeetingId(Long aValue) {
		this.meetingId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="NAME" type="java.lang.String" length="512" not-null="true" unique="false"
	 */
	public String getName() {
		return this.name;
	}
	
	/**
	 * Set the name
	 * @spring.validator type="required"
	 */	
	public void setName(String aValue) {
		this.name = aValue;
	}	

	public String getAttendOfficeLeaders() {
		return attendOfficeLeaders;
	}

	public void setAttendOfficeLeaders(String attendOfficeLeaders) {
		this.attendOfficeLeaders = attendOfficeLeaders;
	}

	
	/**
	 * 	 * @return String
	 * @hibernate.property column="HOST" type="java.lang.String" length="40" not-null="true" unique="false"
	 */
	public String getHost() {
		return this.host;
	}
	
	/**
	 * Set the host
	 * @spring.validator type="required"
	 */	
	public void setHost(String aValue) {
		this.host = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="RECORDER" type="java.lang.String" length="40" not-null="true" unique="false"
	 */
	public String getRecorder() {
		return this.recorder;
	}
	
	/**
	 * Set the recorder
	 * @spring.validator type="required"
	 */	
	public void setRecorder(String aValue) {
		this.recorder = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="RECORD_TIME" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getRecordTime() {
		return this.recordTime;
	}
	
	/**
	 * Set the recordTime
	 */	
	public void setRecordTime(java.util.Date aValue) {
		this.recordTime = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CONTACT_PERSON" type="java.lang.String" length="40" not-null="false" unique="false"
	 */
	public String getContactPerson() {
		return this.contactPerson;
	}
	
	/**
	 * Set the contactPerson
	 */	
	public void setContactPerson(String aValue) {
		this.contactPerson = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CONTACT_TEL" type="java.lang.String" length="40" not-null="false" unique="false"
	 */
	public String getContactTel() {
		return this.contactTel;
	}
	
	/**
	 * Set the contactTel
	 */	
	public void setContactTel(String aValue) {
		this.contactTel = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="HOLD_TIME" type="java.util.Date" length="7" not-null="true" unique="false"
	 */
	public java.util.Date getHoldTime() {
		return this.holdTime;
	}
	
	/**
	 * Set the holdTime
	 * @spring.validator type="required"
	 */	
	public void setHoldTime(java.util.Date aValue) {
		this.holdTime = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="HOLD_LOCATION" type="java.lang.String" length="512" not-null="false" unique="false"
	 */
	public String getHoldLocation() {
		return this.holdLocation;
	}
	
	/**
	 * Set the holdLocation
	 */	
	public void setHoldLocation(String aValue) {
		this.holdLocation = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="ATTEND_TYPE" type="java.lang.Short" length="5" not-null="false" unique="false"
	 */
	public Short getAttendType() {
		return this.attendType;
	}
	
	/**
	 * Set the attendType
	 */	
	public void setAttendType(Short aValue) {
		this.attendType = aValue;
	}	


	/**
	 * 	 * @return String
	 * @hibernate.property column="HOLD_DEP" type="java.lang.String" length="512" not-null="false" unique="false"
	 */
	public String getHoldDep() {
		return this.holdDep;
	}
	
	/**
	 * Set the holdDep
	 */	
	public void setHoldDep(String aValue) {
		this.holdDep = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SHORT_DESC" type="java.lang.String" length="1024" not-null="false" unique="false"
	 */
	public String getShortDesc() {
		return this.shortDesc;
	}
	
	/**
	 * Set the shortDesc
	 */	
	public void setShortDesc(String aValue) {
		this.shortDesc = aValue;
	}	

	public String getAttendLeaders() {
		return attendLeaders;
	}

	public void setAttendLeaders(String attendLeaders) {
		this.attendLeaders = attendLeaders;
	}

	public String getAttendOfficers() {
		return attendOfficers;
	}

	public void setAttendOfficers(String attendOfficers) {
		this.attendOfficers = attendOfficers;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof OutMeeting)) {
			return false;
		}
		OutMeeting rhs = (OutMeeting) object;
		return new EqualsBuilder()
				.append(this.meetingId, rhs.meetingId)
				.append(this.name, rhs.name)
				.append(this.host, rhs.host)
				.append(this.recorder, rhs.recorder)
				.append(this.recordTime, rhs.recordTime)
				.append(this.contactPerson, rhs.contactPerson)
				.append(this.contactTel, rhs.contactTel)
				.append(this.holdTime, rhs.holdTime)
				.append(this.holdLocation, rhs.holdLocation)
				.append(this.attendType, rhs.attendType)
				.append(this.attendLeaders, rhs.attendLeaders)
				.append(this.attendOfficers, rhs.attendOfficers)
				.append(this.holdDep, rhs.holdDep)
				.append(this.shortDesc, rhs.shortDesc)
				.isEquals();
	}
	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.meetingId) 
				.append(this.name) 
				.append(this.host) 
				.append(this.recorder) 
				.append(this.recordTime) 
				.append(this.contactPerson) 
				.append(this.contactTel) 
				.append(this.holdTime) 
				.append(this.holdLocation) 
				.append(this.attendType) 
				.append(this.attendLeaders)
				.append(this.attendOfficers)
				.append(this.holdDep) 
				.append(this.shortDesc) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("meetingId", this.meetingId) 
				.append("name", this.name) 
				.append("host", this.host) 
				.append("recorder", this.recorder) 
				.append("recordTime", this.recordTime) 
				.append("contactPerson", this.contactPerson) 
				.append("contactTel", this.contactTel) 
				.append("holdTime", this.holdTime) 
				.append("holdLocation", this.holdLocation) 
				.append("attendType", this.attendType) 
				.append("attendLeaders",this.attendLeaders)
				.append("attendOfficers",this.attendOfficers)
				.append("holdDep", this.holdDep) 
				.append("shortDesc", this.shortDesc) 
				.toString();
	}



}
