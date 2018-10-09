package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchDispatch;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface ArchDispatchDao extends BaseDao<ArchDispatch>{
	/**
	 * 根据当前用户的角色和用户ID来查找相关的分发人记录
	 */
	public List<ArchDispatch> findByUser(AppUser user,PagingBean pb);
	/**
	 * 根据当前公文ID来查找阅读和处理的记录
	 */
	public List<ArchDispatch> findRecordByArc(Long archivesId);
}