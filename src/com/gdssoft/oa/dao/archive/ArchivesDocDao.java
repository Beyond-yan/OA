package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import java.util.Set;

import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ArchivesDocDao extends BaseDao<ArchivesDoc>{
	/**
	 * 根据公文ID来查找公文撰稿
	 */
	public List<ArchivesDoc> findByAid(Long archivesId);
	/**
	 * 查询公开公文的正文
	 */
	public List<ArchivesDoc> findByArchivesId(String hostUrl,Long archivesId,String schema);
	
	public List getDocByArchivesId(String schemaCode, Long archivesId);//查询指定Schema下正文
	
}