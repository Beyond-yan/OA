package com.gdssoft.oa.service.flow.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.map.ListOrderedMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.flow.ProcessReportDao;
import com.gdssoft.oa.model.flow.ProcessReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.flow.ProcessReportService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.SysConfigService;

public class ProcessReportServiceImpl extends BaseServiceImpl<ProcessReport> implements
		ProcessReportService {
	private ProcessReportDao dao;
	
	@Resource
	private SysConfigService sysConfigService;
	
	@Resource
	private DepartmentService departmentService;
	
	Log log = LogFactory.getLog("ProcessReportServiceImpl");
	public ProcessReportServiceImpl(ProcessReportDao dao) {
		super(dao);
		this.dao = dao;
		// TODO Auto-generated constructor stub
	}
	public List<ProcessReport> getbyauth(HttpServletRequest request,QueryFilter queryFilter,AppUser appUser)
	{
			boolean isSumAdmin = false;
			boolean isSupervisedAdmin = false;
			SysConfig isSumAdminID = sysConfigService.findByKey("sumAdminRoleID");//综合管理员
			SysConfig isSupervisorID = sysConfigService.findByKey("supervisorRoleID");//督办管理员
			SysConfig isArchiveAdminID = sysConfigService.findByKey("archiveAdminRoleID");//公文管理员
			log.info("GGG: 当前用户具有综合管理员角色");
			List<ProcessReport> list = new ArrayList<ProcessReport>();
			
			boolean isAdmin = false;
			for(AppRole role:(appUser.getRoles()).toArray(new AppRole[0]))
			{
				if ((role.getRoleId() == -1L)||(role.getRoleId().toString().equals(isArchiveAdminID.getDataValue())))//管理员权限
				{
					isAdmin = true;
					//list = dao.getallauthAdmin(request, queryFilter);
					list = dao.getAllProcessList(0,appUser.getUserId().toString(),request, queryFilter); //20121113 xt
					break;
				}
				if (role.getRoleId().toString().equals(isSumAdminID.getDataValue())){
					isSumAdmin = true;
					log.info("GGG: 当前用户具有综合管理员角色");
					continue;
				}
				if (role.getRoleId().toString().equals(isSupervisorID.getDataValue())){
					isSupervisedAdmin = true;
					log.info("GGG: 当前用户具有督办管理员角色");
					continue;
				}				
			}
			if (!isAdmin){//非管理员需要过滤		
			
				if ((!isSumAdmin) && (!isSupervisedAdmin)){//非综合管理员且非督办管理员
					request.setAttribute("Q_creatorid_L_EQ", appUser.getUserId());
					request.setAttribute("Q_userid_L_EQ", appUser.getUserId());
					request.setAttribute("Q_ccuserid_L_EQ", appUser.getUserId());
					
//					list = dao.getallauthUser(request, queryFilter);
					list = dao.getAllProcessList(2,appUser.getUserId().toString(),request, queryFilter); //20121113 xt
				}else{//督办管理员or综合管理员 按部门查询 这里必须传入
					Department department = departmentService.get3LevelDept(appUser.getDepartment());
					request.setAttribute("Q_path_S_EQ", department.getPath());
					
					try {
//						list = dao.getallauth(request, queryFilter);
						list = dao.getAllProcessList(1,appUser.getUserId().toString(),request, queryFilter); //20121113 xt
					} catch (Exception e) {
						log.warn("执行查询异常", e);
					}
				}
			}
			//如果同时存在父子流程就剔除子流程
		/*	HashMap<Long,Long> ppMap = new HashMap<Long,Long>();
			Iterator<ProcessReport> itpr = list.iterator();
			System.out.println("test");
			while(itpr.hasNext()){
				Map pp = (Map) itpr.next();
				if(((Long)pp.get("parentid")).equals(0L)){
					ppMap.put((Long)pp.get("runid"), (Long)pp.get("runid"));
				} 
			}
			
			itpr = list.iterator();
			
			for(int count=list.size()-1; count >=0; count--){
				Map pr = (Map)list.get(count);
				if (ppMap.get((Long)pr.get("parentid"))!=null){
					list.remove(count);
				}
			}*/

			return list;
	}

}
