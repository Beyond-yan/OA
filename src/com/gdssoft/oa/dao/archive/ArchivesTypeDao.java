package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.model.archive.ArchivesType;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ArchivesTypeDao extends BaseDao<ArchivesType>{
	public ArchivesType findTypeByName(String name);
	public ArchivesType findTypeByArchivesId(Long archivesId);
}