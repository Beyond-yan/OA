package com.gdssoft.oa.model.system;
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
 * SysDataTransfer Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysDataTransfer extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected Long archivesId;
	protected String archivesno;
	protected String sendDep;
	protected String subject;
	protected Long archtype;
	protected Long issuerid;
	protected String issuer;
	protected String privacylevel;
	protected String urgentlevel;
	protected String sources;
	protected java.util.Date writtenDate;
	protected String receiveDep;
	protected Long transferType;
	protected Long fromSchema;
	protected Long toSchemaId;
	protected java.util.Date receiveDate;
	protected Long receiveFlag;
	protected String rejectMsg;
	protected String createUser;
	protected java.util.Date createDate;
	protected String transactionId;
	protected String receiveUser;
	protected String receiveUserName;
	protected Long dataSource;
	protected String updateUser;
	protected java.util.Date updateDate;
	protected Integer receiveType;
	protected Long runid;
	protected String Schemacode;
	protected Long sourceType;
	protected String sourceUser;
	public Long getRunid() {
		return runid;
	}

	public void setRunid(Long runid) {
		this.runid = runid;
	}
	
	public String getSchemacode() {
		return Schemacode;
	}

	public void setSchemacode(String schemacode) {
		Schemacode = schemacode;
	}

	protected String createUserFullName;

	protected java.util.Set sysArchivesFiless = new java.util.HashSet();
	
	protected SysDepartmentConfig confs = new SysDepartmentConfig();
	
	protected List<SysArchivesFiles> archivesFiles = new ArrayList<SysArchivesFiles>();

	/**
	 * Default Empty Constructor for class SysDataTransfer
	 */
	public SysDataTransfer () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysDataTransfer
	 */
	public SysDataTransfer (
		 Long in_id
        ) {
		this.setId(in_id);
    }


	public java.util.Set getSysArchivesFiless () {
		return sysArchivesFiless;
	}	
	
	public void setSysArchivesFiless (java.util.Set in_sysArchivesFiless) {
		this.sysArchivesFiless = in_sysArchivesFiless;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getId() {
		return this.id;
	}
	
	/**
	 * Set the id
	 */	
	public void setId(Long aValue) {
		this.id = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="ARCHIVES_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getArchivesId() {
		return this.archivesId;
	}
	
	/**
	 * Set the archivesId
	 */	
	public void setArchivesId(Long aValue) {
		this.archivesId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ARCHIVESNO" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getArchivesno() {
		return this.archivesno;
	}
	
	/**
	 * Set the archivesno
	 */	
	public void setArchivesno(String aValue) {
		this.archivesno = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SEND_DEP" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getSendDep() {
		return this.sendDep;
	}
	
	/**
	 * Set the sendDep
	 */	
	public void setSendDep(String aValue) {
		this.sendDep = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SUBJECT" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getSubject() {
		return this.subject;
	}
	
	/**
	 * Set the subject
	 */	
	public void setSubject(String aValue) {
		this.subject = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="ARCHTYPE" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getArchtype() {
		return this.archtype;
	}
	
	/**
	 * Set the archtype
	 */	
	public void setArchtype(Long aValue) {
		this.archtype = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="ISSUERID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getIssuerid() {
		return this.issuerid;
	}
	
	/**
	 * Set the issuerid
	 */	
	public void setIssuerid(Long aValue) {
		this.issuerid = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ISSUER" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getIssuer() {
		return this.issuer;
	}
	
	/**
	 * Set the issuer
	 */	
	public void setIssuer(String aValue) {
		this.issuer = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PRIVACYLEVEL" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getPrivacylevel() {
		return this.privacylevel;
	}
	
	/**
	 * Set the privacylevel
	 */	
	public void setPrivacylevel(String aValue) {
		this.privacylevel = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="URGENTLEVEL" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getUrgentlevel() {
		return this.urgentlevel;
	}
	
	/**
	 * Set the urgentlevel
	 */	
	public void setUrgentlevel(String aValue) {
		this.urgentlevel = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SOURCES" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getSources() {
		return this.sources;
	}
	
	/**
	 * Set the sources
	 */	
	public void setSources(String aValue) {
		this.sources = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="WRITTEN_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getWrittenDate() {
		return this.writtenDate;
	}
	
	/**
	 * Set the writtenDate
	 */	
	public void setWrittenDate(java.util.Date aValue) {
		this.writtenDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="RECEIVE_DEP" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getReceiveDep() {
		return this.receiveDep;
	}
	
	/**
	 * Set the receiveDep
	 */	
	public void setReceiveDep(String aValue) {
		this.receiveDep = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="TRANSFER_TYPE" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getTransferType() {
		return this.transferType;
	}
	
	/**
	 * Set the transferType
	 */	
	public void setTransferType(Long aValue) {
		this.transferType = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="FROM_SCHEMA" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getFromSchema() {
		return this.fromSchema;
	}
	
	/**
	 * Set the fromSchema
	 */	
	public void setFromSchema(Long aValue) {
		this.fromSchema = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="TO_SCHEMA_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getToSchemaId() {
		return this.toSchemaId;
	}
	
	/**
	 * Set the toSchemaId
	 */	
	public void setToSchemaId(Long aValue) {
		this.toSchemaId = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="RECEIVE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getReceiveDate() {
		return this.receiveDate;
	}
	
	/**
	 * Set the receiveDate
	 */	
	public void setReceiveDate(java.util.Date aValue) {
		this.receiveDate = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="RECEIVE_FLAG" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getReceiveFlag() {
		return this.receiveFlag;
	}
	
	/**
	 * Set the receiveFlag
	 */	
	public void setReceiveFlag(Long aValue) {
		this.receiveFlag = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REJECT_MSG" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getRejectMsg() {
		return this.rejectMsg;
	}
	
	/**
	 * Set the rejectMsg
	 */	
	public void setRejectMsg(String aValue) {
		this.rejectMsg = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CREATE_USER" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getCreateUser() {
		return this.createUser;
	}
	
	/**
	 * Set the createUser
	 */	
	public void setCreateUser(String aValue) {
		this.createUser = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
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
	 * @hibernate.property column="TRANSACTION_ID" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getTransactionId() {
		return this.transactionId;
	}
	
	/**
	 * Set the transactionId
	 */	
	public void setTransactionId(String aValue) {
		this.transactionId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="RECEIVE_USER" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getReceiveUser() {
		return this.receiveUser;
	}
	
	/**
	 * Set the receiveUser
	 */	
	public void setReceiveUser(String aValue) {
		this.receiveUser = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="RECEIVE_USER_NAME" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getReceiveUserName() {
		return this.receiveUserName;
	}
	
	/**
	 * Set the receiveUserName
	 */	
	public void setReceiveUserName(String aValue) {
		this.receiveUserName = aValue;
	}	
	
	public Long getDataSource() {
		return this.dataSource;
	}
	
	/**
	 * Set the transferType
	 */	
	public void setDataSource(Long aValue) {
		this.dataSource = aValue;
	}

	public Long getSourceType() {
		return sourceType;
	}

	public void setSourceType(Long sourceType) {
		this.sourceType = sourceType;
	}

	public String getSourceUser() {
		return sourceUser;
	}

	public void setSourceUser(String sourceUser) {
		this.sourceUser = sourceUser;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof SysDataTransfer)) {
			return false;
		}
		SysDataTransfer rhs = (SysDataTransfer) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.archivesId, rhs.archivesId)
				.append(this.archivesno, rhs.archivesno)
				.append(this.sendDep, rhs.sendDep)
				.append(this.subject, rhs.subject)
				.append(this.archtype, rhs.archtype)
				.append(this.issuerid, rhs.issuerid)
				.append(this.issuer, rhs.issuer)
				.append(this.privacylevel, rhs.privacylevel)
				.append(this.urgentlevel, rhs.urgentlevel)
				.append(this.sources, rhs.sources)
				.append(this.writtenDate, rhs.writtenDate)
				.append(this.receiveDep, rhs.receiveDep)
				.append(this.transferType, rhs.transferType)
				.append(this.fromSchema, rhs.fromSchema)
				.append(this.toSchemaId, rhs.toSchemaId)
				.append(this.receiveDate, rhs.receiveDate)
				.append(this.receiveFlag, rhs.receiveFlag)
				.append(this.rejectMsg, rhs.rejectMsg)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
				.append(this.transactionId, rhs.transactionId)
				.append(this.receiveUser, rhs.receiveUser)
				.append(this.receiveUserName, rhs.receiveUserName)
				.append(this.dataSource, rhs.dataSource)
				.append(this.updateUser, rhs.updateUser)
				.append(this.updateDate, rhs.updateDate)
				.append(this.receiveType, rhs.receiveType)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.archivesId) 
				.append(this.archivesno) 
				.append(this.sendDep) 
				.append(this.subject) 
				.append(this.archtype) 
				.append(this.issuerid) 
				.append(this.issuer) 
				.append(this.privacylevel) 
				.append(this.urgentlevel) 
				.append(this.sources) 
				.append(this.writtenDate) 
				.append(this.receiveDep) 
				.append(this.transferType) 
				.append(this.fromSchema) 
				.append(this.toSchemaId) 
				.append(this.receiveDate) 
				.append(this.receiveFlag) 
				.append(this.rejectMsg) 
				.append(this.createUser) 
				.append(this.createDate) 
				.append(this.transactionId) 
				.append(this.receiveUser) 
				.append(this.receiveUserName) 
				.append(this.dataSource)
				.append(this.confs)
				.append(this.archivesFiles)
				.append(this.updateUser) 
				.append(this.updateDate) 
				.append(this.receiveType)
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("archivesId", this.archivesId) 
				.append("archivesno", this.archivesno) 
				.append("sendDep", this.sendDep) 
				.append("subject", this.subject) 
				.append("archtype", this.archtype) 
				.append("issuerid", this.issuerid) 
				.append("issuer", this.issuer) 
				.append("privacylevel", this.privacylevel) 
				.append("urgentlevel", this.urgentlevel) 
				.append("sources", this.sources) 
				.append("writtenDate", this.writtenDate) 
				.append("receiveDep", this.receiveDep) 
				.append("transferType", this.transferType) 
				.append("fromSchema", this.fromSchema) 
				.append("toSchemaId", this.toSchemaId) 
				.append("receiveDate", this.receiveDate) 
				.append("receiveFlag", this.receiveFlag) 
				.append("rejectMsg", this.rejectMsg) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("transactionId", this.transactionId) 
				.append("receiveUser", this.receiveUser) 
				.append("receiveUserName", this.receiveUserName) 
				.append("dataSource",this.dataSource)
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.append("receiveType",this.receiveType)
				.toString();
	}
	
	public SysDepartmentConfig getConfs() {
		return confs;
	}

	public void setConfs(SysDepartmentConfig confs) {
		this.confs = confs;
	}
	
	public List<SysArchivesFiles> getArchivesFiles(){
		return archivesFiles;
	}
	
	public void setArchivesFiles(List<SysArchivesFiles> archivesFiles){
		this.archivesFiles = archivesFiles;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public java.util.Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(java.util.Date updateDate) {
		this.updateDate = updateDate;
	}

	public Integer getReceiveType() {
		return receiveType;
	}

	public void setReceiveType(Integer receiveType) {
		this.receiveType = receiveType;
	}

	public String getCreateUserFullName() {
		return createUserFullName;
	}

	public void setCreateUserFullName(String createUserFullName) {
		this.createUserFullName = createUserFullName;
	}



}
