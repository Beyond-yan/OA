package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface ProcessRunDao extends BaseDao<ProcessRun>{
	/**
	 * 
	 * @param piId
	 * @return
	 */
	public ProcessRun getByPiId(String piId);	
	/**
	 * 
	 * @param defId
	 * @param pb
	 * @return
	 */
	public List<ProcessRun> getByDefId(Long defId,PagingBean pb);
	
	/**
	 * 按标题模糊查询某个用户所参与的流程列表
	 * @param userId
	 * @param subject
	 * @param pb
	 * @return
	 */
	public List<ProcessRun> getByUserIdSubject(Long userId,String subject,PagingBean pb);
	
	public ProcessRun getByPiIdAndSchema(String schema, String piId);	
}