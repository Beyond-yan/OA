package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.archive.LeaderRead;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface LeaderReadDao extends BaseDao<LeaderRead>{
	/**
	 * 根据archivesId和checkName(任务节点名称)查询审批意见
	 * @param archivesId
	 * @param checkName
	 * @return
	 */
	public List<LeaderRead> findByAid(Long archivesId,String checkName);
}