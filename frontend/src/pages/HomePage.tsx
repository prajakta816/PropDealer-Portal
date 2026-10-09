import { ArrowForward, Apartment, Groups, TrendingUp } from '@mui/icons-material'
import { Box, Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context'

const features = [
  {
    icon: <Groups fontSize="large" />,
    title: 'Team Management',
    description:
      'Manage Admins, Agents, and Commission Managers from one organized workspace.',
  },
  {
    icon: <Apartment fontSize="large" />,
    title: 'Property Workflows',
    description:
      'Keep your property operations and team activities organized in one place.',
  },
  {
    icon: <TrendingUp fontSize="large" />,
    title: 'Commission Tracking',
    description:
      'Make commission workflows easier to follow with role-specific tools.',
  },
]

function HomePage() {
  const { isAuthenticated } = useAuth()
  const workspaceTarget = isAuthenticated ? '/dashboard' : '/login'

  return (
    <Box className="overflow-hidden bg-white text-slate-900">
      <Box className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 text-white">
        <Box
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"
        />

        <Container maxWidth="xl" className="relative">
          <Box className="grid min-h-[560px] items-center gap-12 py-20 md:grid-cols-2 md:py-28">
            <Box className="max-w-2xl">
              <Box className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100">
                One workspace. Better property operations.
              </Box>

              <Typography
                component="h1"
                className="!text-4xl !font-extrabold !leading-tight tracking-tight sm:!text-5xl lg:!text-6xl"
              >
                Every property.
                <br />
                Every person.
                <br />
                <span className="text-blue-300">One workspace.</span>
              </Typography>

              <Typography className="!mt-6 !max-w-xl !text-base !leading-8 !text-slate-300 sm:!text-lg">
                Bring your property team, daily workflows, and commission
                management together in one clear, organized workspace.
              </Typography>

              <Box className="mt-9 flex flex-wrap gap-4">
                <Button
                  component={RouterLink}
                  to={workspaceTarget}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  className="rounded-xl bg-blue-500 px-6 py-3 font-semibold normal-case shadow-lg shadow-blue-950/30 hover:bg-blue-400"
                >
                  {isAuthenticated ? 'Open your workspace' : 'Access your workspace'}
                </Button>

                <Button
                  component="a"
                  href="/#features"
                  variant="outlined"
                  className="rounded-xl border-white/30 px-6 py-3 font-semibold normal-case text-white hover:border-white hover:bg-white/10"
                >
                  Explore features
                </Button>
              </Box>

              <Typography className="!mt-6 !text-sm !text-slate-400">
                Built for Admins, Agents, and Commission Managers.
              </Typography>
            </Box>

            <Box className="relative mx-auto w-full max-w-lg">
              <Box className="absolute -inset-4 rounded-[2rem] bg-blue-400/20 blur-2xl" />

              <Box className="relative rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                <Box className="flex items-center justify-between gap-3 border-b border-white/15 pb-5">
                  <Box>
                    <Typography className="!text-sm !text-blue-200">
                      PROPDEALER WORKSPACE
                    </Typography>
                    <Typography className="!mt-1 !text-xl !font-bold !text-white">
                      Team overview
                    </Typography>
                  </Box>

                  <Box className="rounded-xl bg-emerald-400/15 px-3 py-2 text-sm font-medium text-emerald-200">
                    Organized
                  </Box>
                </Box>

                <Box className="grid grid-cols-2 gap-4 py-6">
                  <Box className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <Typography className="!text-sm !text-slate-300">
                      Team access
                    </Typography>
                    <Typography className="!mt-2 !text-2xl !font-bold !text-white">
                      Role-based
                    </Typography>
                    <Typography className="!mt-1 !text-xs !text-blue-200">
                      The right tools for each role
                    </Typography>
                  </Box>

                  <Box className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <Typography className="!text-sm !text-slate-300">
                      Workflows
                    </Typography>
                    <Typography className="!mt-2 !text-2xl !font-bold !text-white">
                      Connected
                    </Typography>
                    <Typography className="!mt-1 !text-xs !text-blue-200">
                      A shared workspace
                    </Typography>
                  </Box>
                </Box>

                <Box className="space-y-3">
                  {['Admin workspace', 'Agent workspace', 'Commission workspace'].map(
                    (item, index) => (
                      <Box
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <Box className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/15 text-sm font-bold text-blue-200">
                          {index + 1}
                        </Box>
                        <Typography className="!font-medium !text-slate-100">
                          {item}
                        </Typography>
                        <Box className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
                      </Box>
                    ),
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="features" className="py-20 sm:py-24">
        <Container maxWidth="xl">
          <Box className="mx-auto mb-14 max-w-2xl text-center">
            <Typography
              component="p"
              className="!text-sm !font-bold !uppercase !tracking-[0.2em] !text-blue-700"
            >
              One connected platform
            </Typography>

            <Typography
              component="h2"
              className="!mt-3 !text-3xl !font-bold tracking-tight sm:!text-4xl"
            >
              Built around your team's workflow
            </Typography>

            <Typography className="!mt-4 !text-base !leading-7 !text-slate-600">
              Give every team member a clear place to work, collaborate, and
              manage their responsibilities.
            </Typography>
          </Box>

          <Box className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Box
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5"
              >
                <Box className="mb-6 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                  {feature.icon}
                </Box>

                <Typography
                  component="h3"
                  className="!text-xl !font-bold !text-slate-900"
                >
                  {feature.title}
                </Typography>

                <Typography className="!mt-3 !leading-7 !text-slate-600">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box id="about" className="border-t border-slate-200 bg-slate-50 py-16">
        <Container maxWidth="xl">
          <Box className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-blue-950 p-8 text-white sm:p-12 md:flex-row md:items-center">
            <Box className="max-w-2xl">
              <Typography
                component="h2"
                className="!text-2xl !font-bold sm:!text-3xl"
              >
                Bring your property team together.
              </Typography>
              <Typography className="!mt-3 !leading-7 !text-blue-100">
                A shared workspace designed to make team responsibilities
                clearer and property operations easier to manage.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to={workspaceTarget}
              variant="contained"
              endIcon={<ArrowForward />}
              className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold normal-case text-blue-950 hover:bg-blue-50"
            >
              Get started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage