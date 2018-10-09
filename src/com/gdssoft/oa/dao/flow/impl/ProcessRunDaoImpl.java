package com.gdssoft.oa.dao.flow.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.flow.ProcessRunDao;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessRun;

public class ProcessRunDaoImpl extends BaseDaoImpl<ProcessRun> implements ProcessRunDao{

	public ProcessRunDaoImpl() {
		super(ProcessRun.class);
	}
	/**
	 * get ProcessRun by PiId
	 * @param piId
	 * @return
	 */
	public ProcessRun getByPiId(String piId){
		String hql="from ProcessRun pr where pr.piId=?";
		ProcessRun processRun=(ProcessRun)findUnique(hql, new Object[]{piId});
		return processRun;
	}
	
	/**
	 * ProcessRun
	 * @param defId
	 * @param pb
	 * @return
	 */
	public List<ProcessRun> getByDefId(Long defId,PagingBean pb){
		String hql=" from ProcessRun pr where pr.proDefinition.defId=? ";
		return findByHql(hql, new Object[]{ defId }, pb);
	}
	
	/**
	 * 按标题模糊查询某个用户所参与的流程列表
	 * @param userId
	 * @param processName
	 * @param pb
	 * @return
	 */
	public List<ProcessRun> getByUserIdSubject(Long userId,String subject,PagingBean pb){
		
		ArrayList params=new ArrayList();
		String hql="select distinct pr from ProcessRun as pr  join pr.processForms as pf where pf.creatorId=?  order by pr.createtime desc";
		params.add(userId);
		if(StringUtils.isNotEmpty(subject)){
			hql+=" and pr.subject like ?";
			params.add("%"+subject+"%");
		}
		
		return findByHql(hql, params.toArray(), pb);
	}
	@Override
	public ProcessRun getByPiIdAndSchema(String schema, String piId) {
		
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql = "select pr.*,pd.* from " + schema +"process_run pr, " + schema
				+ "pro_definition pd where pr.defId = pd.defId and pr.piId = :piId";
		Query query = this.getSession().createSQLQuery(sql).addEntity("pr", ProcessRun.class).addEntity("pd", ProDefinition.class)
				.setParameter("piId", piId);
		List list = query.list();
		if(list.size() > 0){
			Object[] objects = (Object[])list.get(0);
			ProcessRun processRun = (ProcessRun)objects[0];
			ProDefinition proDefinition = (ProDefinition)objects[1];
			processRun.setProDefinition(proDefinition);
			return processRun;
		}else{
			return null;
		}
	}
	
}