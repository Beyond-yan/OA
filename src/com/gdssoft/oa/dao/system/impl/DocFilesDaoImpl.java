package com.gdssoft.oa.dao.system.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Query;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.DocFilesDao;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFiles;

public class DocFilesDaoImpl extends BaseDaoImpl<DocFiles> implements DocFilesDao {
	private Log logger = LogFactory.getLog(AppUserDaoImpl.class);
	public DocFilesDaoImpl() {
		super(DocFiles.class);
	}
	
	public List findByDirectoryId(Long strDirId){
		String hql = "select docf from DocFiles docf where docf.docDirectory.id = ? ";
		Object[] params = { strDirId};
		return findByHql(hql, params);
	}
	
	@Override
	public List findByDepartment(DocDirectory docdirectory) {
		String hql = "select docf from DocFiles docf join docf.docDirectory docd where  docd.id like ? and docf.docDirectory = ?";
		Object[] params = { docdirectory.getId() + "%",
				Constants.FLAG_UNDELETED };
		return findByHql(hql, params);
	}
	/**
	 * 查看公文是否已自动归档
	 * @param schemaCode
	 * @param archivesId
	 */
	public int findDocFilesByArchives(String schemaCode, Long archivesId) {
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode +".";
		String hsql = "SELECT * FROM "+ schemaCode + "CQ_DOC_FILES WHERE archives_id= :archivesId";
		Query query = getSession().createSQLQuery(hsql)
				//.addEntity(DocFiles.class);
				.setParameter("archivesId", archivesId);
		List list = query.list();
		return list.size();
	}
	/**
	 * 自动归档
	 * @param schemaCode
	 * @param docFile
	 */
	public void saveDocFiles(String schemaCode, DocFiles docFile) {
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode +".";
		String hql = "INSERT INTO " + schemaCode + "cq_doc_files(ID, dep_id, file_name, file_no, page_count, file_type, duty_person,"
				+ "secret_level, file_date, file_year,  remark, create_user,"
				+" create_date, update_user, update_date, file_status,retention_year,archives_id,SOURCE_TYPE,FILE_ISSUP)"
				+" VALUES(hibernate_sequence.nextval,:depId,:fileName,:fileNo,:pageCount,:fileType,:dutyPerson,:secretLevel,"
				+":fileDate,:fileYear,:remark,:createUser,sysdate,:updateUser,sysdate,:fileStatus,:retentionYear,"
				+":archivesId,:sourceType,:fileIssup)";
		Query query = getSession().createSQLQuery(hql)
				.setParameter("depId", null == docFile.getDepartment() ? -1L : docFile.getDepartment().getDepId())
				.setParameter("fileName", docFile.getFileName())
				.setParameter("fileNo", docFile.getFileNo())
				.setParameter("pageCount", docFile.getPageCount())
				.setParameter("fileType", docFile.getFileType())
				.setParameter("dutyPerson", docFile.getDutyPerson())
				.setParameter("secretLevel", docFile.getSecretLevel())
				.setParameter("fileDate", docFile.getFileDate())
				.setParameter("fileYear", docFile.getFileYear())
				//.setParameter("retention", docFile.getRetention())
				.setParameter("remark", docFile.getRemark())
				.setParameter("createUser", docFile.getCreateUser())
				.setParameter("updateUser", docFile.getUpdateUser())
				.setParameter("retentionYear", docFile.getRetentionYear())
				.setParameter("fileStatus", docFile.getFileStatus())
				//.setParameter("directoryId", null == docFile.getDocDirectory()?null:docFile.getDocDirectory().getId())
				.setParameter("archivesId", docFile.getArchives().getArchivesId())
				.setParameter("sourceType", docFile.getSourceType())
				.setParameter("fileIssup", docFile.getFileIssup());
		query.executeUpdate();
	}
	
	public Long findMaxId(String schemaCode){
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode +".";
		String sql = "select max(id) from " + schemaCode + "cq_doc_files";
		Query query = this.getSession().createSQLQuery(sql);
		List list = query.list();
		if(list.size()>0){
			return new Long(list.get(0).toString());
		}
		return new Long(-1);
	}
	
	public void saveFileAttach(String schemaCode, Long docFileId, Long fileId){
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode +".";
		String sql = "INSERT INTO " + schemaCode + "CQ_DOC_FILES_ATTACH(DOC_FILES_ID, FILE_ID) "
				+ " values(:docFileId, :fileId)";
		Query query = this.getSession().createSQLQuery(sql)
				.setParameter("docFileId", docFileId)
				.setParameter("fileId", fileId);
		query.executeUpdate();
	}
	/**
	 * 档案管理更新行号
	 * add by sicen.liu/2014.10.29
	 */
	public void updateRowNumber(String schemaCode, Long directoryId, Long rowNumber,Long preRowNumber){
		if(rowNumber!=preRowNumber){
			if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode +".";
			String sql="";
			if(rowNumber < preRowNumber){
				sql = "UPDATE " + schemaCode + "cq_doc_files SET ROW_NUMBER = ROW_NUMBER + 1 WHERE directory_id = :directoryId AND  ROW_NUMBER >= :rowNumber AND ROW_NUMBER < :preRowNumber";
			}else{
				sql = "UPDATE " + schemaCode + "cq_doc_files SET ROW_NUMBER = ROW_NUMBER - 1 WHERE directory_id = :directoryId AND  ROW_NUMBER > :preRowNumber AND ROW_NUMBER <= :rowNumber";
			}
			Query query = this.getSession().createSQLQuery(sql)
					.setParameter("directoryId", directoryId)
					.setParameter("preRowNumber", preRowNumber)
					.setParameter("rowNumber", rowNumber);
			query.executeUpdate();
		}
	}
	/**
	 * 档案管理更新件号
	 * add by sicen.liu/2014.10.30
	 */
	public void updateFileNumber(String schemaCode, Long directoryId, Long fileNumber){
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode +"."; 
		String sql = "UPDATE " + schemaCode + "cq_doc_files SET file_number = :fileNumber + ROW_NUMBER - 1 WHERE directory_id = :directoryId ";
		Query query = this.getSession().createSQLQuery(sql)
				.setParameter("directoryId", directoryId)
				.setParameter("fileNumber", fileNumber);
		query.executeUpdate();
	}
	/**
	 * 档案管理更新行号，重新刷新
	 * add by sicen.liu/2014.11.03
	 */
	public void refreshRowNumber(String schemaCode, Long directoryId){
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode +"."; 
		String sql = "UPDATE " + schemaCode + "cq_doc_files f SET f.ROW_NUMBER = ( SELECT rum FROM ( SELECT ROWNUM AS rum, ID  FROM ( SELECT  ID  FROM "+ schemaCode +"cq_doc_files cdf WHERE cdf.directory_id = :directoryId "
				+" ORDER BY cdf.ROW_NUMBER ASC ) m ) n WHERE n.ID = f.ID ) WHERE f.directory_id = :directoryId";
		Query query = this.getSession().createSQLQuery(sql)
				.setParameter("directoryId", directoryId);
		query.executeUpdate();
	}
}
