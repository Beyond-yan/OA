package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * ArchivesAttend Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 */
public class ArchivesAttend extends com.gdssoft.core.model.BaseModel {

    protected Long attendId;
	protected Long userID;
	protected String fullname;
	protected String attendType;
	protected java.util.Date executeTime;
	protected String memo;
	protected com.gdssoft.oa.model.archive.Archives archives;


	/**
	 * Default Empty Constructor for class ArchivesAttend
	 */
	public ArchivesAttend () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ArchivesAttend
	 */
	public ArchivesAttend (
		 Long in_attendId
        ) {
		this.setAttendId(in_attendId);
    }

	
	public com.gdssoft.oa.model.archive.Archives getArchives () {
		return archives;
	}	
	
	public void setArchives (com.gdssoft.oa.model.archive.Archives in_archives) {
		this.archives = in_archives;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="attendId" type="java.lang.Long" generator-class="native"
	 */
	public Long getAttendId() {
		return this.attendId;
	}
	
	/**
	 * Set the attendId
	 */	
	public void setAttendId(Long aValue) {
		this.attendId = aValue;
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
	 * 用户ID	 * @return Long
	 * @hibernate.property column="userID" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getUserID() {
		return this.userID;
	}
	
	/**
	 * Set the userID
	 * @spring.validator type="required"
	 */	
	public void setUserID(Long aValue) {
		this.userID = aValue;
	}	

	/**
	 * 姓名	 * @return String
	 * @hibernate.property column="fullname" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getFullname() {
		return this.fullname;
	}
	
	/**
	 * Set the fullname
	 * @spring.validator type="required"
	 */	
	public void setFullname(String aValue) {
		this.fullname = aValue;
	}	

	/**
	 * 参与类型
            1=校对人
            2=审核人
            3=缮印人
            4=用印人	 * @return String
	 * @hibernate.property column="attendType" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getAttendType() {
		return this.attendType;
	}
	
	/**
	 * Set the attendType
	 * @spring.validator type="required"
	 */	
	public void setAttendType(String aValue) {
		this.attendType = aValue;
	}	

	/**
	 * 执行时间	 * @return java.util.Date
	 * @hibernate.property column="executeTime" type="java.util.Date" length="19" not-null="false" unique="false"
	 */
	public java.util.Date getExecuteTime() {
		return this.executeTime;
	}
	
	/**
	 * Set the executeTime
	 */	
	public void setExecuteTime(java.util.Date aValue) {
		this.executeTime = aValue;
	}	

	/**
	 * 备注	 * @return String
	 * @hibernate.property column="memo" type="java.lang.String" length="1024" not-null="false" unique="false"
	 */
	public String getMemo() {
		return this.memo;
	}
	
	/**
	 * Set the memo
	 */	
	public void setMemo(String aValue) {
		this.memo = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ArchivesAttend)) {
			return false;
		}
		ArchivesAttend rhs = (ArchivesAttend) object;
		return new EqualsBuilder()
				.append(this.attendId, rhs.attendId)
						.append(this.userID, rhs.userID)
				.append(this.fullname, rhs.fullname)
				.append(this.attendType, rhs.attendType)
				.append(this.executeTime, rhs.executeTime)
				.append(this.memo, rhs.memo)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.attendId) 
						.append(this.userID) 
				.append(this.fullname) 
				.append(this.attendType) 
				.append(this.executeTime) 
				.append(this.memo) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("attendId", this.attendId) 
						.append("userID", this.userID) 
				.append("fullname", this.fullname) 
				.append("attendType", this.attendType) 
				.append("executeTime", this.executeTime) 
				.append("memo", this.memo) 
				.toString();
	}



}
