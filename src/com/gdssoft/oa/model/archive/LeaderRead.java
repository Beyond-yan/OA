package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * LeaderRead Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * ������������
 */
public class LeaderRead extends com.gdssoft.core.model.BaseModel {

	public static Short NOT_CHECK = (short)0 ;//状态为未审批
	public static Short IS_PASS = (short)1 ;//状态为未审批
	public static Short NOT_PASS = (short)2 ;//状态为未审批
	
	
    protected Long readId;
	protected String leaderName;
	protected Long userId;
	protected String leaderOpinion;
	protected java.util.Date createtime;
	protected Integer depLevel;
	protected String depName;
	protected Short isPass;
	protected String checkName;
	
	private String leaderNamePic;
	
	
	//protected com.gdssoft.oa.model.archive.ArchivesDep archivesDep;
	protected com.gdssoft.oa.model.archive.Archives archives;


	/**
	 * Default Empty Constructor for class LeaderRead
	 */
	public LeaderRead () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class LeaderRead
	 */
	public LeaderRead (
		 Long in_readId
        ) {
		this.setReadId(in_readId);
    }

	
//	public com.gdssoft.oa.model.archive.ArchivesDep getArchivesDep () {
//		return archivesDep;
//	}	
//	
//	public void setArchivesDep (com.gdssoft.oa.model.archive.ArchivesDep in_archivesDep) {
//		this.archivesDep = in_archivesDep;
//	}
	
	public com.gdssoft.oa.model.archive.Archives getArchives () {
		return archives;
	}	
	
	public void setArchives (com.gdssoft.oa.model.archive.Archives in_archives) {
		this.archives = in_archives;
	}
    

	public String getCheckName() {
		return checkName;
	}

	public void setCheckName(String checkName) {
		this.checkName = checkName;
	}

	/**
	 * 	 * @return Long
     * @hibernate.id column="readId" type="java.lang.Long" generator-class="native"
	 */
	public Long getReadId() {
		return this.readId;
	}
	
	/**
	 * Set the readId
	 */	
	public void setReadId(Long aValue) {
		this.readId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="leaderName" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getLeaderName() {
		return this.leaderName;
	}
	
	/**
	 * Set the leaderName
	 * @spring.validator type="required"
	 */	
	public void setLeaderName(String aValue) {
		this.leaderName = aValue;
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
	 * @hibernate.property column="leaderOpinion" type="java.lang.String" length="128" not-null="false" unique="false"
	 */
	public String getLeaderOpinion() {
		return this.leaderOpinion;
	}
	
	/**
	 * Set the leaderOpinion
	 */	
	public void setLeaderOpinion(String aValue) {
		this.leaderOpinion = aValue;
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
	 * 主键	 * @return Long
	 */
//	public Long getDepArchId() {
//		return this.getArchivesDep()==null?null:this.getArchivesDep().getArchDepId();
//	}
//	
	/**
	 * Set the depArchId
	 */	
//	public void setDepArchId(Long aValue) {
//	    if (aValue==null) {
//	    	archivesDep = null;
//	    } else if (archivesDep == null) {
//	        archivesDep = new com.gdssoft.oa.model.archive.ArchivesDep(aValue);
//	        archivesDep.setVersion(new Integer(0));//set a version to cheat hibernate only
//	    } else {
//			archivesDep.setArchDepId(aValue);
//	    }
//	}	

	/**
	 * 	 * @return Integer
	 * @hibernate.property column="depLevel" type="java.lang.Integer" length="10" not-null="false" unique="false"
	 */
	public Integer getDepLevel() {
		return this.depLevel;
	}
	
	/**
	 * Set the depLevel
	 */	
	public void setDepLevel(Integer aValue) {
		this.depLevel = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="depName" type="java.lang.String" length="128" not-null="false" unique="false"
	 */
	public String getDepName() {
		return this.depName;
	}
	
	/**
	 * Set the depName
	 */	
	public void setDepName(String aValue) {
		this.depName = aValue;
	}	

	/**
	 * 0=尚未批
            1=审批通过
            2=审批未通过	 * @return Short
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

	public String getLeaderNamePic() {
		return leaderNamePic;
	}

	public void setLeaderNamePic(String leaderNamePic) {
		this.leaderNamePic = leaderNamePic;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof LeaderRead)) {
			return false;
		}
		LeaderRead rhs = (LeaderRead) object;
		return new EqualsBuilder()
				.append(this.readId, rhs.readId)
				.append(this.leaderName, rhs.leaderName)
				.append(this.userId, rhs.userId)
				.append(this.leaderOpinion, rhs.leaderOpinion)
				.append(this.createtime, rhs.createtime)
								.append(this.depLevel, rhs.depLevel)
				.append(this.depName, rhs.depName)
				.append(this.isPass, rhs.isPass)
				.append(this.checkName, rhs.checkName)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.readId) 
				.append(this.leaderName) 
				.append(this.userId) 
				.append(this.leaderOpinion) 
				.append(this.createtime) 
								.append(this.depLevel) 
				.append(this.depName) 
				.append(this.isPass) 
				.append(this.checkName)
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("readId", this.readId) 
				.append("leaderName", this.leaderName) 
				.append("userId", this.userId) 
				.append("leaderOpinion", this.leaderOpinion) 
				.append("createtime", this.createtime) 
								.append("depLevel", this.depLevel) 
				.append("depName", this.depName) 
				.append("isPass", this.isPass) 
				.append("checkName",this.checkName)
				.toString();
	}



}
