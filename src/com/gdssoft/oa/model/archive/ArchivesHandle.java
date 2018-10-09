package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.google.gson.annotations.Expose;

/**
 * ArchivesHandle Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * ���������������
 */
public class ArchivesHandle extends com.gdssoft.core.model.BaseModel {

    @Expose
	protected Long handleId;
    @Expose
	protected String handleOpinion;
    @Expose
	protected Long userId;
    @Expose
	protected String userFullname;
    @Expose
	protected java.util.Date createtime;
    @Expose
	protected java.util.Date fillTime;
    @Expose
	protected Short isPass;
	protected com.gdssoft.oa.model.archive.Archives archives;


	/**
	 * Default Empty Constructor for class ArchivesHandle
	 */
	public ArchivesHandle () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ArchivesHandle
	 */
	public ArchivesHandle (
		 Long in_handleId
        ) {
		this.setHandleId(in_handleId);
    }

	
	public com.gdssoft.oa.model.archive.Archives getArchives () {
		return archives;
	}	
	
	public void setArchives (com.gdssoft.oa.model.archive.Archives in_archives) {
		this.archives = in_archives;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="handleId" type="java.lang.Long" generator-class="native"
	 */
	public Long getHandleId() {
		return this.handleId;
	}
	
	/**
	 * Set the handleId
	 */	
	public void setHandleId(Long aValue) {
		this.handleId = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getArchivesId() {
		return this.getArchives()==null?null:this.getArchives().getArchivesId();
	}
	
	/**
	 * Set the archivesId
	 */	
	public void setArchivesId(Long aValue) {
	    if (aValue==null) {
	    	archives = null;
	    } else if (archives == null) {
	        archives = new com.gdssoft.oa.model.archive.Archives(aValue);
	        archives.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			archives.setArchivesId(aValue);
	    }
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="handleOpinion" type="java.lang.String" length="1024" not-null="false" unique="false"
	 */
	public String getHandleOpinion() {
		return this.handleOpinion;
	}
	
	/**
	 * Set the handleOpinion
	 */	
	public void setHandleOpinion(String aValue) {
		this.handleOpinion = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="userId" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getUserId() {
		return this.userId;
	}
	
	/**
	 * Set the userId
	 * @spring.validator type="required"
	 */	
	public void setUserId(Long aValue) {
		this.userId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="userFullname" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getUserFullname() {
		return this.userFullname;
	}
	
	/**
	 * Set the userFullname
	 * @spring.validator type="required"
	 */	
	public void setUserFullname(String aValue) {
		this.userFullname = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="createtime" type="java.util.Date" length="19" not-null="true" unique="false"
	 */
	public java.util.Date getCreatetime() {
		return this.createtime;
	}
	
	/**
	 * Set the createtime
	 * @spring.validator type="required"
	 */	
	public void setCreatetime(java.util.Date aValue) {
		this.createtime = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="fillTime" type="java.util.Date" length="19" not-null="false" unique="false"
	 */
	public java.util.Date getFillTime() {
		return this.fillTime;
	}
	
	/**
	 * Set the fillTime
	 */	
	public void setFillTime(java.util.Date aValue) {
		this.fillTime = aValue;
	}	

	/**
	 * 0=尚未审批
            1=通过审批
            ２=未通过审批	 * @return Short
	 * @hibernate.property column="isPass" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsPass() {
		return this.isPass;
	}
	
	/**
	 * Set the isPass
	 * @spring.validator type="required"
	 */	
	public void setIsPass(Short aValue) {
		this.isPass = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ArchivesHandle)) {
			return false;
		}
		ArchivesHandle rhs = (ArchivesHandle) object;
		return new EqualsBuilder()
				.append(this.handleId, rhs.handleId)
						.append(this.handleOpinion, rhs.handleOpinion)
				.append(this.userId, rhs.userId)
				.append(this.userFullname, rhs.userFullname)
				.append(this.createtime, rhs.createtime)
				.append(this.fillTime, rhs.fillTime)
				.append(this.isPass, rhs.isPass)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.handleId) 
						.append(this.handleOpinion) 
				.append(this.userId) 
				.append(this.userFullname) 
				.append(this.createtime) 
				.append(this.fillTime) 
				.append(this.isPass) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("handleId", this.handleId) 
						.append("handleOpinion", this.handleOpinion) 
				.append("userId", this.userId) 
				.append("userFullname", this.userFullname) 
				.append("createtime", this.createtime) 
				.append("fillTime", this.fillTime) 
				.append("isPass", this.isPass) 
				.toString();
	}



}
