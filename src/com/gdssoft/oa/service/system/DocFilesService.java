package com.gdssoft.oa.service.system;

import java.io.InputStream;
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFiles;

public interface DocFilesService extends BaseService<DocFiles>{
	//按部门查找
	public List findByDirectoryId(Long strDirId);
	
	//按条件查找
	public List findByDocDirectory(String path,PagingBean pb,String name,Date fileDate,Date retention,String code);
	
	/**
	 * 根据公文Id将存在待归档目录
	 * @param archivesId
	 * @param createUser
	 */
	public void saveDocFilesFromArchives(Long archivesId,String createUser);
	/**
	 * 批量根据公文Id将存在待归档目录
	 * @param archivesIdList
	 * @param createUser
	 */
	public void saveDocFilesFromArchivesList(List<Archives> archivesList,String createUser);
	/**
	 * 批量自动归档
	 * @param schemaCode
	 * @param docFile
	 */
	public void saveArchiveToFiles(String schemaCode,List<Archives> archiveList,String createUser);
	
	public void saveDocFiles(String schemaCode, DocFiles docFile);
	/**
	 * 查看公文是否已自动归档
	 * @param schemaCode
	 * @param archivesId
	 */
	public int findDocFilesByArchives(String schemaCode, Long archivesId);
	
	/**
	 * 档案列表导出excel
	 * add by sicen.liu
	 * @param user 
	 */
	public InputStream sentlistToExcel(DocDirectory docDirectory ,List<DocFiles> list, String user);
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
