package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ArchivesDepDao extends BaseDao<ArchivesDep>{
	/**
	 * 获得已分发文件的部门
	 * @param archivesId
	 * @return
	 */
	public List<ArchivesDep> getSentArchsByArchId(Long archivesId);
	
	/**
	 * 获得已分发文件的部门
	 * @param archivesId
	 * @return
	 */
	public List<ArchivesDep> getByArchAndDep(Long archivesId,Long depId);
}