package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchivesHandle;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ArchivesHandleDao extends BaseDao<ArchivesHandle>{
	/**
	 * 根据当前用户的ID和所属的公文ID来查找记录
	 */
	public ArchivesHandle findByUAIds(Long userId,Long archiveId);
	/**
	 * 根据所属公文ID来查找记录
	 */
	public List<ArchivesHandle> findByAid(Long archiveId);
}