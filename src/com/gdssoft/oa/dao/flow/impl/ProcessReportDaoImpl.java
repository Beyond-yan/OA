package com.gdssoft.oa.dao.flow.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.flow.ProcessReportDao;
import com.gdssoft.oa.model.flow.ProcessReport;

public class ProcessReportDaoImpl extends BaseDaoImpl<ProcessReport> implements
		ProcessReportDao {

	Log log = LogFactory.getLog("ProcessReportDaoImpl");

	public ProcessReportDaoImpl() {
		super(ProcessReport.class);
	}

	/**
	 * 查詢所有流程(整合以下所有方法)
	 */
	@Override
	public List<ProcessReport> getAllProcessList(final int userType,
			final String userId, HttpServletRequest request,
			QueryFilter queryFilter) {
		// 开始日期
		final String createtime;
		if (request.getParameter("Q_createtime_D_GT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_GT")))) {
			createtime = request.getParameter("Q_createtime_D_GT");

		} else {
			createtime = request.getParameter("queryStartDate");
		}
		// 截至日期
		final String endtime;
		if (request.getParameter("Q_createtime_D_LT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_LT")))) {
			endtime = request.getParameter("Q_createtime_D_LT");
		} else {
			endtime = request.getParameter("queryEndDate");
		}
		System.out.println("endtimeTest");
		final String proTypeId = (String) (request.getParameter("proTypeId") == null ? ""
				: request.getParameter("proTypeId"));

		final String subjectValue = (String) (request
				.getParameter("Q_subject_S_EQ") == null ? "" : request
				.getParameter("Q_subject_S_EQ"));
		final String issueDep = (String) (request
				.getParameter("Q_issueDep_S_LK") == null ? "" : request
				.getParameter("Q_issueDep_S_LK"));
		final String creator = (String) (request.getParameter("Q_creator_S_LK") == null ? ""
				: request.getParameter("Q_creator_S_LK"));

		String type = (String) (request.getParameter("Q_type_S_EQ") == null ? ""
				: request.getParameter("Q_type_S_EQ"));
		final int typeInt = ("creator".equals(type) ? 1 : ("takepart"
				.equals(type) ? 2 : ("cc".equals(type) ? 3 : 0)));

		List<ProcessReport> tempList = new ArrayList<ProcessReport>();
		List resultList = (List) jdbcTemplate.execute(
				new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call " + schemaName + "Process_Report_sp(?,?,?,?,?,?,?,?,?,?)}";// 调用的sql
						CallableStatement cs = con.prepareCall(storedProc);
						cs.setString(1, String.valueOf(typeInt)); // 查询类别
																	// ,0流程综合查询，1我发起的，2我参与的，3阅知的，4抄报的，5已完成的
						cs.setString(2, String.valueOf(userType));// --查询类别
																	// ,0超级管理员，1部门管理员，2个人，3，4，5
						cs.setString(3, userId);// userid
						cs.setString(4, createtime);// -- startDate
													// '2012-10-1等日期格式'
						cs.setString(5, endtime);// 结束时间
						cs.setString(6, proTypeId);// --流程类型
						cs.setString(7, subjectValue);// --按主题查询
						cs.setString(8, issueDep);// --按发起部门查询
						cs.setString(9, creator);// --按发起人查询
						// 注册输出参数的类型
						cs.registerOutParameter(10,oracle.jdbc.OracleTypes.CURSOR);
						return cs;
					}
				}, new CallableStatementCallback() {
					@SuppressWarnings("unchecked")
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						List resultsMap = new ArrayList();

						cs.execute();
						ResultSet rs = (ResultSet) cs.getObject(10);
						while (rs.next()) {// 转换每行的返回值到Map中
							Map rowMap = new HashMap();
							rowMap.put("name", rs.getString(1));
							rowMap.put("runid", rs.getString(2));
							rowMap.put("creator", rs.getString(3));
							rowMap.put("userid", rs.getString(4));
							rowMap.put("issueDep", rs.getString(5));
							rowMap.put("createtime", rs.getString(6));
							rowMap.put("subject", rs.getString(7));
							rowMap.put("defid", rs.getString(8));
							rowMap.put("piid", rs.getString(9));
							rowMap.put("parentid", rs.getString(10));
							rowMap.put("runStatus", rs.getString(11));
							rowMap.put("datavalue", rs.getString(12));
							rowMap.put("ccuserid", rs.getString(13));
							rowMap.put("status", rs.getString(14));
							rowMap.put("archivesid", rs.getString(15));
							resultsMap.add(rowMap);
						}
						rs.close();
						return resultsMap;
					}
				});
		ProcessReport cpr = null;
		System.out.println("size:" + resultList.size());
		for (int i = 0; i < resultList.size(); i++) {
			cpr = new ProcessReport();
			Map rowMap = (Map) resultList.get(i);
			String name = rowMap.get("name").toString();
			String runid = rowMap.get("runid").toString();
			String creatorStr = rowMap.get("creator").toString();
			String useridStr = rowMap.get("userid").toString();
			String issueDepStr = rowMap.get("issueDep").toString();
			String createtimeStr = rowMap.get("createtime").toString();
			System.out.println("createtimeStr:" + createtimeStr);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date date = new Date();
			try {
				date = sdf.parse(createtimeStr);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			System.out.println("dt:" + date);

			String subject = rowMap.get("subject").toString();

			String defid = rowMap.get("defid").toString();
			String piid = rowMap.get("piid").toString();
			String parentid = rowMap.get("parentid").toString();

			String runStatus = rowMap.get("runStatus").toString();
			String datavalue = rowMap.get("datavalue").toString();
			String ccuseridStr = "";
			if(null != rowMap.get("ccuserid"))
				ccuseridStr = rowMap.get("ccuserid").toString();
			int status = Integer.parseInt(rowMap.get("status").toString());
			String archivesid="";
			if(rowMap.get("archivesid")!=null)
			archivesid = rowMap.get("archivesid").toString();
			//Long archivesid = Long.parseLong(rowMap.get("archivesid").toString());

			cpr.setName(name);
			cpr.setRunid(new Long(runid));
			cpr.setCreator(creatorStr);
			cpr.setUserid(new Long(useridStr));
			cpr.setIssuedep(issueDepStr);

			cpr.setCreatetime(date);
			cpr.setSubject(subject);
			cpr.setDefid(new Long(defid));

			cpr.setPiid(piid);
			cpr.setDefid(new Long(defid));
			cpr.setParentid(new Long(parentid));

			cpr.setRunStatus(Integer.parseInt(runStatus));
			cpr.setDatavalue(datavalue);
			cpr.setStatus(status);
			if (!"".equals(archivesid)){
				cpr.setArchivesid(new Long(archivesid));
			}
			if (!"".equals(ccuseridStr)) {
				cpr.setCcuserid(new Long(ccuseridStr));
			}
			tempList.add(cpr);
		}
		return tempList;

	}

	/**
	 * 部门管理员查询部门所有流程
	 */
	@Override
	public List<ProcessReport> getallauth(HttpServletRequest request,
			QueryFilter queryFilter) {
		// String hql =
		// "select distinct new ProcessReport(defid,createtime,userid,"
		// + "creator,issuedep,subject,name,runid,"
		// + "piid,datavalue,runStatus) from ProcessReport A ";
		String sqlstr = "select distinct defid,createtime,A.userid,creator,"
				+ "	issuedep,subject,name,runid,piid,datavalue,runStatus,A.parentid, A.status, A.ccuserid "
				+ "	from Process_Report A "
				+ "   left join app_User UA ON UA.userid = A.userid "
				+ "	LEFT JOIN department DA ON DA.depId = UA.depId"
				+ " 	LEFT JOIN app_User UB ON UB.userid = A.CCUSERID "
				+ "	LEFT JOIN department DB ON DB.depId = UB.depId "
				+ "	LEFT JOIN app_User UC ON UC.userid = A.creatorid"
				+ "	LEFT JOIN department DC ON DC.depId = UC.depId";

		// 过滤‘已终止’流程 runStatus<>3 SuperTask=0 父流程
		String conhql = "";
		conhql += " where runStatus <> 3  ";

		String concreatorhql = "";
		if (request.getAttribute("Q_creatorid_L_EQ") != null
				&& (!("").equals(request.getAttribute("Q_creatorid_L_EQ")
						.toString()))) {
			concreatorhql += " creatorid= "
					+ request.getAttribute("Q_creatorid_L_EQ");

		}

		if (!("").equals(concreatorhql)) {
			concreatorhql = " and (" + concreatorhql;
		}
		if (request.getAttribute("Q_userid_L_EQ") != null
				&& (!("").equals(request.getAttribute("Q_userid_L_EQ")
						.toString()))) {
			if (!("").equals(concreatorhql)) {
				concreatorhql += " or ";
			} else {
				concreatorhql += " and ( ";
			}

			concreatorhql += " A.userid=  "
					+ request.getAttribute("Q_userid_L_EQ");

		}

		if (request.getAttribute("Q_ccuserid_L_EQ") != null
				&& (!("").equals(request.getAttribute("Q_ccuserid_L_EQ")
						.toString()))) {
			if (!("").equals(concreatorhql)) {
				concreatorhql += " or ";
			} else {
				concreatorhql += " and (";
			}
			concreatorhql += " ccuserid="
					+ request.getAttribute("Q_ccuserid_L_EQ");

		}
		if (!("").equals(concreatorhql)) {
			concreatorhql += ")";
		}

		conhql += concreatorhql;

		// 开始日期
		String strStartDateParam = "";
		if (request.getParameter("Q_createtime_D_GT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_GT")))) {
			strStartDateParam = request.getParameter("Q_createtime_D_GT")
					+ " 00:00:00";

		} else {
			strStartDateParam = request.getParameter("queryStartDate")
					+ " 00:00:00";
		}

		conhql += " and createtime >='" + strStartDateParam + "' ";

		// 截至日期
		String strEndDateParam = "";
		if (request.getParameter("Q_createtime_D_LT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_LT")))) {
			strEndDateParam = request.getParameter("Q_createtime_D_LT")
					+ " 23:59:59";

		} else {
			strEndDateParam = request.getParameter("queryEndDate")
					+ " 23:59:59";
		}

		conhql += " and  createtime <='" + strEndDateParam + "'";

		// 类别 分为我发起的，我参与的,抄送给我的
		if (request.getParameter("Q_type_S_EQ") != null
				&& (!("").equals(request.getParameter("Q_type_S_EQ")))) {
			conhql += " and ";
			if (request.getParameter("Q_type_S_EQ").equals("creator")) {
				conhql += " A.userid =" + request.getAttribute("Q_typeid");
			} else if (request.getParameter("Q_type_S_EQ").equals("takepart")) {
				conhql += " creatorid =" + request.getAttribute("Q_typeid");
			} else if (request.getParameter("Q_type_S_EQ").equals("cc")) {
				conhql += " ccuserid =" + request.getAttribute("Q_typeid");
			} else {
				conhql += " A.userid =" + request.getAttribute("Q_typeid");
			}

		}
		// 类型
		if (request.getParameter("proTypeId") != null
				&& (!("").equals(request.getParameter("proTypeId")))) {
			conhql += " and  defid =" + request.getParameter("proTypeId");
		}

		// 按主题查询

		if (request.getParameter("Q_subject_S_EQ") != null
				&& (!("").equals(request.getParameter("Q_subject_S_EQ")))) {
			conhql += " and  subject like '%"
					+ request.getParameter("Q_subject_S_EQ") + "%'";
		}
		// 按发起部门查询
		// if (request.getParameter("Q_issueDep_S_EQ") != null
		// && (!("").equals(request.getParameter("Q_issueDep_S_EQ")))) {
		// conhql +=
		// " and  issuedep='"+request.getParameter("Q_issueDep_S_EQ")+"'";
		// }
		// 20121011 edit xt
		log
				.debug("q_issueDep_s_lk1:"
						+ request.getParameter("Q_issueDep_S_LK"));
		if (request.getParameter("Q_issueDep_S_LK") != null
				&& (!("").equals(request.getParameter("Q_issueDep_S_LK")))) {
			conhql += " and  issuedep like '%"
					+ request.getParameter("Q_issueDep_S_LK") + "%'";
			log.debug("conhql:" + conhql);
		}
		// 按发起人查询
		if (request.getParameter("Q_creator_S_LK") != null
				&& (!("").equals(request.getParameter("Q_creator_S_LK")))) {
			conhql += " and  creator like '%"
					+ request.getParameter("Q_creator_S_LK") + "%'";
		}

		if (request.getAttribute("Q_path_S_EQ") != null
				&& (!("")
						.equals(request.getAttribute("Q_path_S_EQ").toString()))) {
			// 如果是部门管理员，如果能看到父流程，就不显示子流程；
			conhql += " and (DA.path like '"
					+ (String) request.getAttribute("Q_path_S_EQ") + "%' "
					+ " or DB.path like '"
					+ (String) request.getAttribute("Q_path_S_EQ") + "%' "
					+ " or DC.path like '"
					+ (String) request.getAttribute("Q_path_S_EQ") + "%' ) ";
			//			
		}

		// 排序
		String strSort = "";
		if (request.getParameter("sort") != null
				&& (!("").equals(request.getParameter("sort")))) {
			strSort = " order by " + request.getParameter("sort") + " "
					+ request.getParameter("dir");

		} else {
			strSort = " order by createtime desc ";
		}
		conhql += strSort;

		sqlstr += conhql;

		System.out.print("---------------Sql:" + sqlstr
				+ "------------------------");
		List<ProcessReport> list = null;
		list = jdbcTemplate.queryForList(sqlstr);

		return list;
	}

	/**
	 * 超级管理员的查询
	 */
	@Override
	public List<ProcessReport> getallauthAdmin(HttpServletRequest request,
			QueryFilter queryFilter) {
		String sqlstr = "select distinct defid,createtime,A.userid,creator,"
				+ "	issuedep,subject,name,runid,piid,datavalue,runStatus,A.parentid, A.status, A.ccuserid "
				+ "	from Process_Report A ";

		// 过滤‘已终止’流程 runStatus<>3 SuperTask=0 父流程
		String conhql = "";
		conhql += " where runStatus <> 3  ";

		// 开始日期
		String strStartDateParam = "";
		if (request.getParameter("Q_createtime_D_GT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_GT")))) {
			strStartDateParam = request.getParameter("Q_createtime_D_GT")
					+ " 00:00:00";

		} else {
			strStartDateParam = request.getParameter("queryStartDate")
					+ " 00:00:00";
		}

		conhql += " and createtime >='" + strStartDateParam + "' ";

		// 截至日期
		String strEndDateParam = "";
		if (request.getParameter("Q_createtime_D_LT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_LT")))) {
			strEndDateParam = request.getParameter("Q_createtime_D_LT")
					+ " 23:59:59";

		} else {
			strEndDateParam = request.getParameter("queryEndDate")
					+ " 23:59:59";
		}

		conhql += " and  createtime <='" + strEndDateParam + "'";

		// 类别 分为我发起的，我参与的,抄送给我的
		if (request.getParameter("Q_type_S_EQ") != null
				&& (!("").equals(request.getParameter("Q_type_S_EQ")))) {
			conhql += " and ";
			if (request.getParameter("Q_type_S_EQ").equals("creator")) {
				conhql += " A.userid =" + request.getAttribute("Q_typeid");
			} else if (request.getParameter("Q_type_S_EQ").equals("takepart")) {
				conhql += " creatorid =" + request.getAttribute("Q_typeid");
			} else if (request.getParameter("Q_type_S_EQ").equals("cc")) {
				conhql += " ccuserid =" + request.getAttribute("Q_typeid");
			} else {
				conhql += " A.userid =" + request.getAttribute("Q_typeid");
			}

		}
		// 类型
		if (request.getParameter("proTypeId") != null
				&& (!("").equals(request.getParameter("proTypeId")))) {
			conhql += " and  defid =" + request.getParameter("proTypeId");
		}

		// 按主题查询

		if (request.getParameter("Q_subject_S_EQ") != null
				&& (!("").equals(request.getParameter("Q_subject_S_EQ")))) {
			conhql += " and  subject like '%"
					+ request.getParameter("Q_subject_S_EQ") + "%'";
		}
		// 按发起部门查询
		// if (request.getParameter("Q_issueDep_S_EQ") != null
		// && (!("").equals(request.getParameter("Q_issueDep_S_EQ")))) {
		// conhql +=
		// " and  issuedep='"+request.getParameter("Q_issueDep_S_EQ")+"'";
		// }
		// 20121011 edit xt
		log
				.debug("q_issueDep_s_lk2:"
						+ request.getParameter("Q_issueDep_S_LK"));
		if (request.getParameter("Q_issueDep_S_LK") != null
				&& (!("").equals(request.getParameter("Q_issueDep_S_LK")))) {
			conhql += " and  issuedep like '%"
					+ request.getParameter("Q_issueDep_S_LK") + "%'";
			log.debug("conhql:" + conhql);
		}

		// 按发起人查询
		if (request.getParameter("Q_creator_S_LK") != null
				&& (!("").equals(request.getParameter("Q_creator_S_LK")))) {
			conhql += " and  creator like '%"
					+ request.getParameter("Q_creator_S_LK") + "%'";
		}

		// 排序
		String strSort = "";
		if (request.getParameter("sort") != null
				&& (!("").equals(request.getParameter("sort")))) {
			strSort = " order by " + request.getParameter("sort") + " "
					+ request.getParameter("dir");

		} else {
			strSort = " order by createtime desc ";
		}
		conhql += strSort;
		sqlstr += conhql;
		System.out.print("---------------Sql:" + sqlstr
				+ "------------------------");

		List<ProcessReport> list = null;
		list = jdbcTemplate.queryForList(sqlstr);

		return list;
	}

	/**
	 * 普通员工查询个人所有流程
	 */
	@Override
	public List<ProcessReport> getallauthUser(HttpServletRequest request,
			QueryFilter queryFilter) {
		String sqlstr = "select distinct defid,createtime,A.userid,creator,"
				+ "	issuedep,subject,name,runid,piid,datavalue,runStatus,A.parentid, A.status, A.ccuserid "
				+ "	from Process_Report A "
				+ "   left join app_User UA ON UA.userid = A.userid "
				+ " 	LEFT JOIN app_User UB ON UB.userid = A.CCUSERID "
				+ "	LEFT JOIN app_User UC ON UC.userid = A.creatorid";

		// 过滤‘已终止’流程 runStatus<>3 SuperTask=0 父流程
		String conhql = "";
		conhql += " where runStatus <> 3  ";

		String concreatorhql = "";
		if (request.getAttribute("Q_creatorid_L_EQ") != null
				&& (!("").equals(request.getAttribute("Q_creatorid_L_EQ")
						.toString()))) {
			concreatorhql += " creatorid= "
					+ request.getAttribute("Q_creatorid_L_EQ");

		}

		if (!("").equals(concreatorhql)) {
			concreatorhql = " and (" + concreatorhql;
		}
		if (request.getAttribute("Q_userid_L_EQ") != null
				&& (!("").equals(request.getAttribute("Q_userid_L_EQ")
						.toString()))) {
			if (!("").equals(concreatorhql)) {
				concreatorhql += " or ";
			} else {
				concreatorhql += " and ( ";
			}

			concreatorhql += " A.userid=  "
					+ request.getAttribute("Q_userid_L_EQ");

		}

		if (request.getAttribute("Q_ccuserid_L_EQ") != null
				&& (!("").equals(request.getAttribute("Q_ccuserid_L_EQ")
						.toString()))) {
			if (!("").equals(concreatorhql)) {
				concreatorhql += " or ";
			} else {
				concreatorhql += " and (";
			}
			concreatorhql += " ccuserid="
					+ request.getAttribute("Q_ccuserid_L_EQ");

		}
		if (!("").equals(concreatorhql)) {
			concreatorhql += ")";
		}

		conhql += concreatorhql;

		// 开始日期
		String strStartDateParam = "";
		if (request.getParameter("Q_createtime_D_GT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_GT")))) {
			strStartDateParam = request.getParameter("Q_createtime_D_GT")
					+ " 00:00:00";

		} else {
			strStartDateParam = request.getParameter("queryStartDate")
					+ " 00:00:00";
		}

		conhql += " and createtime >='" + strStartDateParam + "' ";

		// 截至日期
		String strEndDateParam = "";
		if (request.getParameter("Q_createtime_D_LT") != null
				&& (!("").equals(request.getParameter("Q_createtime_D_LT")))) {
			strEndDateParam = request.getParameter("Q_createtime_D_LT")
					+ " 23:59:59";

		} else {
			strEndDateParam = request.getParameter("queryEndDate")
					+ " 23:59:59";
		}

		conhql += " and  createtime <='" + strEndDateParam + "'";

		// 类别 分为我发起的，我参与的,抄送给我的
		if (request.getParameter("Q_type_S_EQ") != null
				&& (!("").equals(request.getParameter("Q_type_S_EQ")))) {
			conhql += " and ";
			if (request.getParameter("Q_type_S_EQ").equals("creator")) {
				conhql += " A.userid =" + request.getAttribute("Q_typeid");
			} else if (request.getParameter("Q_type_S_EQ").equals("takepart")) {
				conhql += " creatorid =" + request.getAttribute("Q_typeid");
			} else if (request.getParameter("Q_type_S_EQ").equals("cc")) {
				conhql += " ccuserid =" + request.getAttribute("Q_typeid");
			} else {
				conhql += " A.userid =" + request.getAttribute("Q_typeid");
			}

		}
		// 类型
		if (request.getParameter("proTypeId") != null
				&& (!("").equals(request.getParameter("proTypeId")))) {
			conhql += " and  defid =" + request.getParameter("proTypeId");
		}

		// 按主题查询

		if (request.getParameter("Q_subject_S_EQ") != null
				&& (!("").equals(request.getParameter("Q_subject_S_EQ")))) {
			conhql += " and  subject like '%"
					+ request.getParameter("Q_subject_S_EQ") + "%'";
		}
		// 按发起部门查询
		// if (request.getParameter("Q_issueDep_S_EQ") != null
		// && (!("").equals(request.getParameter("Q_issueDep_S_EQ")))) {
		// conhql +=
		// " and  issuedep='"+request.getParameter("Q_issueDep_S_EQ")+"'";
		// }
		// 20121011 edit xt
		log
				.debug("q_issueDep_s_lk3:"
						+ request.getParameter("Q_issueDep_S_LK"));
		if (request.getParameter("Q_issueDep_S_LK") != null
				&& (!("").equals(request.getParameter("Q_issueDep_S_LK")))) {
			conhql += " and  issuedep like '%"
					+ request.getParameter("Q_issueDep_S_LK") + "%'";
			log.debug("conhql:" + conhql);
		}

		// 按发起人查询
		if (request.getParameter("Q_creator_S_LK") != null
				&& (!("").equals(request.getParameter("Q_creator_S_LK")))) {
			conhql += " and  creator like '%"
					+ request.getParameter("Q_creator_S_LK") + "%'";
		}

		// 排序
		String strSort = "";
		if (request.getParameter("sort") != null
				&& (!("").equals(request.getParameter("sort")))) {
			strSort = " order by " + request.getParameter("sort") + " "
					+ request.getParameter("dir");

		} else {
			strSort = " order by createtime desc ";
		}
		conhql += strSort;

		sqlstr += conhql;
		System.out.print("---------------Sql:" + sqlstr
				+ "------------------------");

		List<ProcessReport> list = null;
		list = jdbcTemplate.queryForList(sqlstr);

		return list;
	}

	@Override
	public Boolean testList() {
		List<ProcessReport> tempList = new ArrayList<ProcessReport>();
		List resultList = (List) jdbcTemplate.execute(
				new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call "+schemaName+"test_sp(?,?)}";
						CallableStatement cs = con.prepareCall(storedProc);
						cs.setString(1, "23");
						cs.registerOutParameter(2,
								oracle.jdbc.OracleTypes.CURSOR);
						return cs;
					}
				}, new CallableStatementCallback() {
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						List resultsList = new ArrayList();
						cs.execute();
						ResultSet rs = (ResultSet) cs.getObject(2);
						while (rs.next()) {
							Map rowMap = new HashMap();
							rowMap.put("fullname", rs.getString(1));
							rowMap.put("userId", rs.getBigDecimal(2));
							resultsList.add(rowMap);
							System.out.println("fullname:"
									+ rowMap.get("fullname") + ",userId:"
									+ rowMap.get("userId"));
						}
						rs.close();
						return resultsList;
					}
				});

		System.out.println("size:" + resultList.size());
		return true;
	}

}
