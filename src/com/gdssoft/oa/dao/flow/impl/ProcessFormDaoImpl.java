package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.Query;

import com.gdssoft.oa.dao.flow.ProcessFormDao;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.util.StringUtil;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ProcessFormDaoImpl extends BaseDaoImpl<ProcessForm> implements ProcessFormDao{

	public ProcessFormDaoImpl() {
		super(ProcessForm.class);
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.flow.ProcessFormDao#getByRunId(java.lang.Long)
	 */
	public List getByRunId(Long runId){
		//String hql="from ProcessForm pf where pf.processRun.runId=? and pf.activityName!=? order by pf.formId asc";
		String hql="from ProcessForm pf where pf.processRun.runId=?  order by pf.formId asc";
		return findByHql(hql, new Object[]{runId});
	}
	public List getBySchemacodeRunId(Long runId,String Schemacode){
		
		//String hql="from ProcessForm pf where pf.processRun.runId=? and pf.activityName!=? order by pf.formId asc";
		String sql="select  pf.formid,pf.runid,pf.activityname,pf.sn,to_char(pf.createtime,'YYYY-MM-DD HH24:MI:SS'),pf.creatorid,pf.creatorname,pf.status,pf.comments,pf.type from  "+ Schemacode + ".PROCESS_FORM pf where pf.runId="+runId+" order by pf.formId asc";
		Query q = getSession().createSQLQuery(sql);
		List list=q.list();
		List<ProcessForm> tempList = new ArrayList<ProcessForm>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			ProcessForm apply = new ProcessForm();
			apply.setFormId(new Long(objs[0].toString()));
			 if(null!=objs[1])
			apply.setRunId(new Long(objs[1].toString()));
			 if(null!=objs[2])
			apply.setActivityName(objs[2].toString());
			 if(null!=objs[3])
			apply.setSn(new Integer(objs[3].toString()));
			 if(null!=objs[4])
	        try {
				apply.setCreatetime(sdf.parse(objs[4].toString()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} if(null!=objs[5]) 
				apply.setCreatorId(new Long(objs[5].toString()));
			if(null!=objs[6]) 
	        apply.setCreatorName(objs[6].toString());
	        if(null!=objs[7])
	        apply.setStatus(objs[7].toString());
        	 if(null!=objs[8]) apply.setComments(objs[8].toString());
	        if(null!=objs[9])  apply.setType(new Long(objs[9].toString()));
			tempList.add(apply);
		}
		return tempList;
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.flow.ProcessFormDao#getByRunIdActivityName(java.lang.Long, java.lang.String)
	 */
	public ProcessForm getByRunIdActivityName(Long runId,String activityName){
		//取得最新的sn号
		Integer maxSn=getActvityExeTimes(runId, activityName).intValue();
		String hql="from ProcessForm pf where pf.processRun.runId=? and pf.activityName=? and pf.sn=?";
		return (ProcessForm)findUnique(hql, new Object[]{runId,activityName,maxSn});
	}
	
	/**
	 * 构造最新的流程实例对应的所有字段及数据
	 * @param runId
	 * @return
	 */
	public Map getVariables(Long runId,String SchemaCode){
		Map variables=new HashMap();
		String sql=" SELECT * FROM "+SchemaCode+".FORM_DATA WHERE DATAID IN("
				+" SELECT MAX(FD.DATAID) "
				+" FROM "+SchemaCode+".FORM_DATA FD,"+SchemaCode+".PROCESS_FORM PF "
				+" WHERE PF.FORMID=FD.FORMID "
				+" AND (LONGVALUE IS NOT NULL OR INTVALUE IS NOT NULL OR STRVALUE IS NOT NULL)"
				+" AND RUNID= "+runId
				+" GROUP BY FIELDNAME) ORDER BY FORMID ASC";
		Query q = getSession().createSQLQuery(sql);
		List<FormData> formDatalist=new ArrayList<FormData>();
		List list=q.list();
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);//458
			variables.put(objs[3].toString(), StringUtil.nullObject2String(objs[4])
					+StringUtil.nullObject2String(objs[5])+StringUtil.nullObject2String(objs[8]));
		}
		return variables;
	}
	public Map getVariables(Long runId){
		Map variables=new HashMap();
		String hql="from ProcessForm pf where pf.processRun.runId=? order by pf.createtime desc";
		List<ProcessForm> forms=findByHql(hql,new Object[]{runId});
		
		for(ProcessForm form : forms){
			Iterator<FormData> formDataIt = form.getFormDatas().iterator();
			while(formDataIt.hasNext()){
				FormData formData=formDataIt.next();
				if(!variables.containsKey(formData.getFieldName())){//放置最新的值
					variables.put(formData.getFieldName(), formData.getVal());
				}
			}
		}
		return variables;
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.flow.ProcessFormDao#getActvityExeTimes(java.lang.Long, java.lang.String)
	 */
	public Long getActvityExeTimes(Long runId,String activityName){
		String hql="select count(pf.formId) from ProcessForm pf where pf.processRun.runId=? and pf.activityName=? ";
		return (Long)findUnique(hql, new Object[]{runId,activityName});
	}

}