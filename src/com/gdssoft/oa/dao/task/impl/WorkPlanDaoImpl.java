package com.gdssoft.oa.dao.task.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.task.WorkPlanDao;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.task.WorkPlan;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class WorkPlanDaoImpl extends BaseDaoImpl<WorkPlan> implements WorkPlanDao{

	public WorkPlanDaoImpl() {
		super(WorkPlan.class);
	}

	@Override
	public List<WorkPlan> findByDepartment(WorkPlan workPlan,AppUser user, PagingBean pb) {
		StringBuffer sb=new StringBuffer();
		ArrayList list=new ArrayList();
	    if(!user.getRights().contains(AppRole.SUPER_RIGHTS)){
			sb.append("select distinct wp.planId from WorkPlan wp,PlanAttend pa where pa.workPlan=wp and wp.status=1 and wp.isPersonal=0 and ((pa.appUser.userId=? and pa.isDep=0)");
			Department dep=user.getDepartment();
			list.add(user.getUserId());
			if(dep!=null){
				String path=dep.getPath();
			    if(StringUtils.isNotEmpty(path)){
					StringBuffer buff=new StringBuffer(path.replace(".", ","));
					buff.deleteCharAt(buff.length()-1);
					sb.append(" or (pa.department.depId in ("+buff.toString()+") and pa.isDep=1)");
				}
			}
			sb.append(")");
	    }else{
	    	sb.append("select distinct wp.planId from WorkPlan wp where wp.status=1 and wp.isPersonal=0");
	    }
		if(workPlan!=null){
			if(StringUtils.isNotEmpty(workPlan.getPlanName())){
				sb.append(" and wp.planName like ?");
				list.add("%"+workPlan.getPlanName()+"%");
			}
			if(StringUtils.isNotEmpty(workPlan.getPrincipal())){
				sb.append(" and wp.principal like ?");
				list.add("%"+workPlan.getPrincipal()+"%");
			}
			if(workPlan.getPlanType()!=null){
				if(workPlan.getPlanType().getTypeId()!=null){
					sb.append(" and wp.planType.typeId = ?");
					list.add(workPlan.getPlanType().getTypeId());
				}
			}
		}
		List planIds=find(sb.toString(),list.toArray(),pb);
		//sb.append(" group by wp.planId");
		return getByIds(planIds);
	}
	
	
	private List<WorkPlan> getByIds(List planIds){
		String hql="from WorkPlan wp where wp.planId in (";
		StringBuffer sbplanIds=new StringBuffer();
		for(int i=0;i<planIds.size();i++){
			sbplanIds.append(planIds.get(i).toString()).append(",");
		}
		if(planIds.size()>0){
			sbplanIds.deleteCharAt(sbplanIds.length()-1);
			hql+=sbplanIds.toString() + ") order by wp.planId desc";
			return (findByHql(hql));
		}else{
			return new ArrayList();
		}
	}

}