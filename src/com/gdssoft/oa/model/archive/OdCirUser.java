package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * OdCirUser Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class OdCirUser extends com.gdssoft.core.model.BaseModel {

    protected Long cirUserId;
	protected String path;
	protected java.util.Date readDate;
	protected com.gdssoft.oa.model.system.AppUser sendUser;
	protected com.gdssoft.oa.model.system.AppUser recUser;
	protected com.gdssoft.oa.model.archive.OdCirPaper odCirPaper;
	protected com.gdssoft.oa.model.flow.ProcessRun processRun;

	  /**
	 * 是否已读-0 代表未读 1 代表已读
	 */
    protected short isRead;

	/**
	 * Default Empty Constructor for class OdCirUser
	 */
	public OdCirUser () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class OdCirUser
	 */
	public OdCirUser (
		 Long in_cirUserId
        ) {
		this.setCirUserId(in_cirUserId);
    }

	
	public com.gdssoft.oa.model.system.AppUser getSendUser() {
		return sendUser;
	}

	public void setSendUser(com.gdssoft.oa.model.system.AppUser sendUser) {
		this.sendUser = sendUser;
	}

	public com.gdssoft.oa.model.system.AppUser getRecUser() {
		return recUser;
	}

	public void setRecUser(com.gdssoft.oa.model.system.AppUser recUser) {
		this.recUser = recUser;
	}

	public com.gdssoft.oa.model.archive.OdCirPaper getOdCirPaper () {
		return odCirPaper;
	}	
	
	public void setOdCirPaper (com.gdssoft.oa.model.archive.OdCirPaper in_odCirPaper) {
		this.odCirPaper = in_odCirPaper;
	}
	
	public com.gdssoft.oa.model.flow.ProcessRun getProcessRun () {
		return processRun;
	}	
	
	public void setProcessRun (com.gdssoft.oa.model.flow.ProcessRun in_processRun) {
		this.processRun = in_processRun;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="CIR_USER_ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getCirUserId() {
		return this.cirUserId;
	}
	
	/**
	 * Set the cirUserId
	 */	
	public void setCirUserId(Long aValue) {
		this.cirUserId = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getCirPaperId() {
		return this.getOdCirPaper()==null?null:this.getOdCirPaper().getCirPaperId();
	}
	
	/**
	 * Set the cirPaperId
	 */	
	public void setCirPaperId(Long aValue) {
	    if (aValue==null) {
	    	odCirPaper = null;
	    } else if (odCirPaper == null) {
	        odCirPaper = new com.gdssoft.oa.model.archive.OdCirPaper(aValue);
	        odCirPaper.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			odCirPaper.setCirPaperId(aValue);
	    }
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PATH" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getPath() {
		return this.path;
	}
	
	/**
	 * Set the path
	 */	
	public void setPath(String aValue) {
		this.path = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getProcessRunId() {
		return this.getProcessRun()==null?null:this.getProcessRun().getRunId();
	}
	
	/**
	 * Set the processRunId
	 */	
	public void setProcessRunId(Long aValue) {
	    if (aValue==null) {
	    	processRun = null;
	    } else if (processRun == null) {
	        processRun = new com.gdssoft.oa.model.flow.ProcessRun(aValue);
	        processRun.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			processRun.setRunId(aValue);
	    }
	}	


	/**
	 * 	 * @return Long
	 */
	public Long getSendUserId() {
		return this.getSendUser()==null?null:this.getSendUser().getUserId();
	}
	
	/**
	 * Set the recUserId
	 */	
	public void setSendUserId(Long aValue) {
	    if (aValue==null) {
	    	sendUser = null;
	    } else if (sendUser == null) {
	    	sendUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	    	sendUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
	    	sendUser.setUserId(aValue);
	    }
	}	
	
	/**
	 * 	 * @return Long
	 */
	public Long getRecUserId() {
		return this.getRecUser()==null?null:this.getRecUser().getUserId();
	}
	
	/**
	 * Set the recUserId
	 */	
	public void setRecUserId(Long aValue) {
	    if (aValue==null) {
	    	recUser = null;
	    } else if (recUser == null) {
	    	recUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	    	recUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
	    	recUser.setUserId(aValue);
	    }
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="READ_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getReadDate() {
		return this.readDate;
	}
	
	/**
	 * Set the readDate
	 */	
	public void setReadDate(java.util.Date aValue) {
		this.readDate = aValue;
	}	

	
	public short getIsRead() {
		return isRead;
	}

	public void setIsRead(short isRead) {
		this.isRead = isRead;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof OdCirUser)) {
			return false;
		}
		OdCirUser rhs = (OdCirUser) object;
		return new EqualsBuilder()
				.append(this.cirUserId, rhs.cirUserId)
						.append(this.path, rhs.path)
						.append(this.readDate, rhs.readDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.cirUserId) 
						.append(this.path) 
						.append(this.readDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("cirUserId", this.cirUserId) 
						.append("path", this.path) 
						.append("readDate", this.readDate) 
				.toString();
	}



}
