package com.gdssoft.oa.dao.system;

import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFiles;

public interface DocFilesDao extends BaseDao<DocFiles>{
	public List findByDirectoryId(Long strDirId);
	public List findByDepartment(DocDirectory docdirectory);
	/**
	 * 查看公文是否已自动归档
	 * @param schemaCode
	 * @param archivesId
	 */
	public int findDocFilesByArchives(String schemaCode, Long archivesId);
	/**
	 * 自动归档
	 * @param schemaCode
	 * @param docFile
	 */
	public void saveDocFiles(String schemaCode, DocFiles docFile) ;
	
	public void saveFileAttach(String schemaCode, Long docFileId, Long fileId);
	
	public Long findMaxId(String schemaCode);
	/**
	 * 更新行号
	 * @param schemaCode
	 * @param directoryId
	 * @param rowNumber
	 * add by sicen.liu/2014.10.29
	 */
	public void updateRowNumber(String schemaCode, Long directoryId, Long rowNumber,Long preRowNumber);
	/**
	 * 档案管理更新件号
	 * add by sicen.liu/2014.10.30
	 */
	public void updateFileNumber(String schemaCode, Long directoryId, Long fileNumber);
	/**
	 * 档案管理更新行号，重新刷新
	 * add by sicen.liu/2014.11.03
	 */
	public void refreshRowNumber(String schemaCode, Long directoryId);
}
